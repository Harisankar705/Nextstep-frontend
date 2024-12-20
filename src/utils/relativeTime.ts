
export const getRelativeTime=(timeStamp:string|number|Date):string=>{
    const now=new Date().getTime()
    const time=new Date(timeStamp).getTime()
    const diff=now-time
    const minute=60*1000
    const hour=minute*60
    const day=hour*24
    const week=day*7
    const month=day*30
    const year=day*265
    if(diff<minute)
    {
        const seconds=Math.floor(diff/1000)
        return `${seconds} ${seconds===1?'second':'seconds'} ago`

    }
    else if(diff<hour)
    {
        const minutes=Math.floor(diff/minute)
        return `${minutes} ${minute===1?'minute':'minutes'} ago`

    }
    else if(diff<day)
    {
        const hours=Math.floor(diff/hour)
        return `${hours} ${hours===1?'hour':'hours'} ago`

    }
    else if(diff<week)
    {
        const weeks=Math.floor(diff/week)
        return `${weeks} ${weeks===1?'week':'weeks'}ago`

    }
    else if(diff<month)
    {
        const months=Math.floor(diff/month)
        return `${months} ${months===1?'month':'months'} ago`

    }
    else (diff<year)
    {
        const years=Math.floor(diff/year)
        return `${years} ${year===1?'year':'years'} ago`

    }

}