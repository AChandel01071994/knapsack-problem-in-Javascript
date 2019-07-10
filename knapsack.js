{
    // 1- knapsack using greedy approach (fractions allowed)
    function knapsackGreedy(items, capacity){
        let spaceLeft = capacity, totalWeight = 0, maxProfit = 0;

        // calculate per kg value
        for(let item of items){
            item.perKGValue = item.value / item.weight; 
        }
        // sort in descending order by perKGValue
        items = items.sort((a, b) => b.perKGValue - a.perKGValue);

        // fill the bag
        for(let item of items){
            item.usedPortion = null;
            // if bag has space remaining & space is less than total capacity of bag
             if(spaceLeft > 0 && item.weight <= capacity) {
                 // if space remaining is greater or equal to item weight
                 if(spaceLeft >= item.weight){
                     spaceLeft -= item.weight;
                     item.usedPortion = 1;
                 } else {
                 // if item weight is greater than space remaining
                     item.usedPortion = spaceLeft / item.weight;
                     spaceLeft = 0;
                 }
             }
             // calculate total weight & max profiit achieved
             if(item.usedPortion !== null){
                 totalWeight = totalWeight + item.weight * item.usedPortion;
                 maxProfit = maxProfit + item.value * item.usedPortion;
             }
        }
        return {
            items,
            totalWeight,
            maxProfit
        }
         
    }

    // 2- 0/1 knapsack using Dynamic programming (bottom up approach)
    function knapsackTabulation(items, capacity){
        // sort edges in ascending order by weight
        items = items.sort((a,b) => a.weight - b.weight);
        let tabulationMatrix = [];
        
        // loop through total weights (j) & items (i)
        for(let i = 0; i < items.length; i++){

            // initialize i th array
            tabulationMatrix[i] = [];
            for (let j = 0; j <= capacity; j++ ){

                let value;
                // if total weight available is 0 then set 0
                if(j === 0) {
                    tabulationMatrix[i][j] = 0;
                    continue;
                }

                // if weight is less than item weight; pick weight of previous item
                if(j < items[i].weight){
                    value = isValidIndex(items.length - 1, capacity, i - 1, j) 
                    ? tabulationMatrix[i - 1][j] : 0;
                // else; either include or exclude current item
                } else {
                    let includeRow = i - 1, includeCol = j - items[i].weight;
                    let excludeRow = i - 1, excludeCol = j;
                    // include; current item value + value of previous item with difference weight
                    let includeValue = items[i].value + (isValidIndex(items.length - 1, capacity, includeRow, includeCol) 
                    ? tabulationMatrix[includeRow][includeCol] : 0);
                    // exclude; pick last item's weight
                    let excludeValue = isValidIndex(items.length - 1, capacity, excludeRow, excludeCol) 
                    ? tabulationMatrix[excludeRow][excludeCol] : 0;
                    // set max value
                    value = Math.max(includeValue, excludeValue);
                }
                tabulationMatrix[i][j] = value;
            }
        }
        let row = items.length - 1, col = capacity, itemsIncluded = [];
        let maxValue = tabulationMatrix[row][col];

        while(true){
            if(col === 0) break;
            let value = tabulationMatrix[row][col];
            let prevValue = tabulationMatrix[row - 1] ? tabulationMatrix[row - 1][col] : null;
            if(value !== prevValue) itemsIncluded.push(items[row])
            else {
                row = row - 1;
                continue;
            }
            col = col - items[row].weight;
            row = row - 1;
        }

        return{
            tabulationMatrix,
            maxValue,
            itemsIncluded
        }
    }

    function isValidIndex(rowSize, colSize, row, col){
        return row >= 0 && col >= 0 && row <= rowSize && col <= colSize;
    }
    
//     let items  = [
//         {id : 1, weight : 5, value : 7},
//         {id : 2, weight : 4, value : 5},
//         {id : 3, weight : 2, value : 4},
//         {id : 4, weight : 3, value : 4},
//         {id : 5, weight : 1, value : 1}
//     ]

//     knapsackTabulation(items, 9);

  let items  = [
        {id : 1, weight : 1, value : 1},
        {id : 2, weight : 3, value : 4},
        {id : 3, weight : 4, value : 5},
        {id : 4, weight : 5, value : 7}
    ]

knapsackTabulation(items, 7);
}
