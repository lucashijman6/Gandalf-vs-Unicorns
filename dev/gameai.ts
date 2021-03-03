/// <reference path="knight.ts" />
/// <reference path="tile.ts" />

class GameAI {
    public static maxTreeHeight: number = 7;
    public static bestMove: [number, number];
    public static movingKnight: Knight;

    public static moveKnight(king:King, knights:Knight[], gameState:GameState) {
        let t0 = performance.now();

        // Call the minimax function to start the AI
        this.minimax(0, false, gameState, -Infinity, Infinity, king, knights);

        this.movingKnight.setPosition(this.bestMove);
        gameState.knightPositions[knights.indexOf(this.movingKnight)] = this.bestMove;

        let t1 = performance.now();
        console.log("AI move took " + (t1 - t0) + " milliseconds.");
    }
    
    public static minimax(treeHeight: number, isMax: boolean, gameState: GameState, alpha: number, beta: number, king: King, knights: Knight[]): number {
        let score = gameState.getScore();

        // Check if the game is over
        // Check if the leaf has been reached
        // If either or is the case, return the score of the future game state
        if(score[1] || treeHeight === this.maxTreeHeight) {
            return score[0];
        }
        
        if (isMax) {
            let bestValueForPlayer = -Infinity;
            let validMoves = king.getMoves(gameState.kingPos);
            for(let i = 0; i < validMoves.length; i++) {
                let gameStateCopy = gameState.copy();
                gameStateCopy.kingPos = validMoves[i];

                let currentMoveValue = this.minimax(treeHeight + 1, false, gameStateCopy, alpha, beta, king, knights) - treeHeight;
                
                beta = Math.max(beta, currentMoveValue);
                if(beta <= alpha) {
                    break;
                }
                
                bestValueForPlayer = Math.max(bestValueForPlayer, currentMoveValue);
            }

            return bestValueForPlayer;
        } else {
            let bestValueForPlayer = Infinity
            for(let i = 0; i < knights.length; i++) {
                let validMoves = knights[i].getMoves(gameState.knightPositions[i]);
                for(let j = 0; j < validMoves.length; j++) {
                    let gameStateCopy = gameState.copy();
                    gameStateCopy.knightPositions[i] = validMoves[j];

                    let currentMoveValue = this.minimax(treeHeight + 1, true, gameStateCopy, alpha, beta, king, knights) + treeHeight;

                    // Check if it's the current turn
                    // Check if current move is better than the previous best
                    
                    if(treeHeight === 0 && currentMoveValue < bestValueForPlayer) {
                        // If both are the case, save the knight that moves and the move itself
                        this.movingKnight = knights[i];
                        this.bestMove = gameStateCopy.knightPositions[i];
                    }

                    alpha = Math.min(alpha, currentMoveValue);
                    if(beta <= alpha) {
                        break;
                    }

                    bestValueForPlayer = Math.min(bestValueForPlayer, currentMoveValue);
                }
            }

            return bestValueForPlayer;
        }
    }
}