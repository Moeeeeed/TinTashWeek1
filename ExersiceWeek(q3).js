function sum(a)
 {
  return function(b) 
  {
    if (b === undefined)
     {
      return a;
    }
    return sum(a + b);//reecursive case
  };
}
 
console.log(sum(1)(2)(3)());
console.log(sum(1)(2)(3)(4)(5)());
 