//q-1

function SumArguments()
{
    if (arguments.length==0 )
    {
        console.log("No elements in the array\n");
        return 0; 
    }
    else if(arguments.length==1)
    {

        console.log("there is no arguments please enter >1 \n");
        return arguments[0];

    }
    else
    {
    var sum=0;
    
    for (let i =0;i!=arguments.length;i++)
    {
      sum=sum+arguments[i];  
    }
   return sum;
    }
}

//test cases 

//case-1
console.log(`The Sum of Arguments is ${SumArguments(1,2,3)}
`);

//case-2
console.log(`The Sum of Arguments is ${SumArguments(1,2,3,4,5,6,7,8,9)}
`);

//case-3
let array1=[];
for (let i=0;i<100;i++)
{
array1.push(i);
}
console.log(`The Sum of Arguments is ${SumArguments(...array1)}
`);

///case-4
console.log(`The Sum of Arguments is ${SumArguments(1)}
`);

//case-5
console.log(`The Sum of Arguments is ${SumArguments()}
`);