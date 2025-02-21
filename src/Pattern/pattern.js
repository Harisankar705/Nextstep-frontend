function printPattern(n)
{
    for(let i=1;i<=n;i++)
    {
        let stars=''
        let spaces=''
        for(let j=1;j<=n-i;j++)
        {
            spaces+=' '
        }
        for(let k=1;k<2*i-1;k++)
        {
            stars+='*'
        }
        console.log(spaces+stars)
    }

}
printPattern(5)