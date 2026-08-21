function sum(a)
 {
  return function(b) 
  {
    // An empty final call tells us to return the accumulated value.
    if (b === undefined)
     {
      return a;
    }
    // Keep returning functions so more values can be chained.
    return sum(a + b);
  };
}
 
console.log(sum(1)(2)(3)());
console.log(sum(1)(2)(3)(4)(5)());
 