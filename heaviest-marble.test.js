  
// side note:
// 
// The easiest solution to this is to send a bunch of emails to your submission email 
// cycling through no more than a range of ~20 numbers but I suspect that wouldn't get 
// candidates anywhere, though if I was on your side I'd setup the other 26 email 
// addresses just to trap people trying to game the riddle ;)

// we'll need a simple sum routine to compare the sides of the scales
const sum = (marbles) => marbles.reduce((acc, cur) => acc+cur, 0)

test('array sum works', () => {
  expect(sum([1,2,4])).toBe(7)
  expect(sum([0])).toBe(0)
  expect(sum([])).toBe(0)
});

// now I need to split the marbles in hand and keep an odd 
// marble aside if one exists
const splitMarbles = (marbles) => {
  let removedMarble = null

  if(marbles.length % 2 === 1){
    // odd
    removedMarble = marbles.pop()
  } else {
    // even, can test
  }

  const splitPoint = marbles.length / 2

  if(splitPoint === 0){
    return { left:[], right:[], removed: null }
  }

  return {
    left: marbles.slice(0, splitPoint),
    right: marbles.slice(splitPoint, marbles.length),
    removed: removedMarble
  }
}

test('split works', () => {
  expect(splitMarbles([1,2,3,4,5])).toStrictEqual({
    left:[1,2],
    right:[3,4],
    removed: 5
  })
  expect(splitMarbles([1,2,3,4,5,6])).toStrictEqual({
    left:[1,2,3],
    right:[4,5,6],
    removed: null
  })
  expect(splitMarbles([1])).toStrictEqual({
    left:[],
    right:[],
    removed: null
  })
});


const heavierSide = (marbles) => {

  if(marbles.length === 1){
    // if this is called with one marble remaining it's an
    // unnecessary weighing
    throw new Error(`You've found the heaviest!`)
  }

  const { left, right, removed } = splitMarbles(marbles)

  const leftSideSum = sum(left)
  const rightSideSum = sum(right)

  const appendRemovedIfPresent = (arr) => {

    return removed === null
      ? arr
      : [...arr, removed]

    // syntacically complicated conditional spread version some may
    // prefer -
    // return [...arr, ...(removed !== null ? [removed] : [])]
  }

  if(leftSideSum > rightSideSum){
    // left is heavier ...
    return appendRemovedIfPresent(left)
  } else if(leftSideSum < rightSideSum){
    // right is heavier ...
    return appendRemovedIfPresent(right)
  } else if (removed !== null && leftSideSum === rightSideSum) {
    // if removed exists and sides are equal, removed must be heaviest marble
    // return null to exit
    return null;
  } else {
    throw new Error('Unexpected result')
  }

}


test('heavier side works', () => {
  expect(heavierSide([1,2,1,1])).toStrictEqual([1,2])
  expect(heavierSide([1,1,2,1])).toStrictEqual([2,1])
  expect(heavierSide([1,1,1,1,1,1,1,1,1,1,1,2,1,1,1,1])).toStrictEqual([1,1,1,2,1,1,1,1])
});

test('heavierSide throws error if no marble is heaviest', () => {
  expect(() => heavierSide([1,1])).toThrowError()
});

test('heavierSide throws error if it didnt need to be called', () => {
  expect(() => heavierSide([1])).toThrowError()
});

const weighsToFindHeaviestMarble = (marbles) => {

  let remainingMarbles = marbles
  let weighings = 0
  
  while(remainingMarbles != null && remainingMarbles.length > 1){
    weighings++
    // console.log({ weighings, remainingMarbles })
    remainingMarbles = heavierSide(remainingMarbles)
  }

  return weighings
}

test('weights for heaviest marble', () => {

  const allMarbles = new Array(27).fill(1)

  // set hidden fat marble
  allMarbles[17] = 2
  
  const weighs = weighsToFindHeaviestMarble(allMarbles)

  expect(weighs).toBe(5)
})

test('all combinations', () => {

  const marbleTestCase = (heavyPos) => {
    const allMarbles = new Array(27).fill(1)
    
    // set hidden fat marble
    allMarbles[heavyPos] = 2

    return allMarbles
  }

  const weighResults = [];

  let testCasePos = 0
  while(testCasePos <= 26) {
    const weighs = weighsToFindHeaviestMarble(marbleTestCase(testCasePos))

    weighResults.push(weighs)
    //console.log({ testCasePos, weighs })
  
    testCasePos++
  }

  console.log(weighResults)
 
})




