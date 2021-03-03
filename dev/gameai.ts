/// <reference path="knight.ts" />
/// <reference path="tile.ts" />

class GameAI {
    public static maxTreeHeight: number = 7;
    public static bestMove: [number, number];
    public static movingKnight: Knight;

    public static moveKnight(king:King, knights:Knight[], gameState:GameState) {
        let t0 = performance.now();

        // Call the minimax function to start the AI
        this.minimax(0, false, gameState, -Infinity, Infinity, king, knights); // Flip

        this.movingKnight.setPosition(this.bestMove);
        gameState.knightPositions[knights.indexOf(this.movingKnight)] = this.bestMove;

        let t1 = performance.now();
        console.log("AI move took " + (t1 - t0) + " milliseconds.");
    }
    
    public static minimax(treeHeight: number, isMax: boolean, gameState: GameState, alpha: number, beta: number, king: King, knights: Knight[]): number {
        let score = gameState.getScore();

        if(score[1] || treeHeight === this.maxTreeHeight) {
            return score[0];
        }
        
        if (isMax) {
            let bestValueForPlayer = -Infinity;
            let validMoves = king.getMoves(gameState.kingPos);
            for(let i = 0; i < validMoves.length; i++) {
                let gameStateCopy = gameState.copy();
                gameStateCopy.kingPos = validMoves[i];

                let moveValue = this.minimax(treeHeight + 1, false, gameStateCopy, alpha, beta, king, knights) - treeHeight;
                
                beta = Math.max(beta, moveValue);
                if(beta <= alpha) {
                    break;
                }
                
                bestValueForPlayer = Math.max(bestValueForPlayer, moveValue);
            }

            return bestValueForPlayer;
        } else {
            let bestValueForPlayer = Infinity
            knights.forEach((knight, knightIndex) => {
                let validMoves = knight.getMoves(gameState.knightPositions[knightIndex]);
                for(let i = 0; i < validMoves.length; i++) {
                    let gameStateCopy = gameState.copy();
                    gameStateCopy.knightPositions[knightIndex] = validMoves[i];

                    let moveValue = this.minimax(treeHeight + 1, true, gameStateCopy, alpha, beta, king, knights) + treeHeight;

                    if(treeHeight === 0 && moveValue < bestValueForPlayer) {
                        this.movingKnight = knight;
                        this.bestMove = gameStateCopy.knightPositions[knightIndex];
                    }

                    alpha = Math.min(alpha, moveValue);
                    if(beta <= alpha) {
                        break;
                    }

                    bestValueForPlayer = Math.min(bestValueForPlayer, moveValue);
                }
            })

            return bestValueForPlayer;
        }
    }
}