import { useState } from "react";
import toast from "react-hot-toast";
 export const sanitizeText=(text:string):string=>{
        return text.replace(/<[^>]*>/g, '');
    }
    export const validateImage=(file:File):boolean=>{
        const allowedTypes=['image/jpeg','image/png','image/gif','image/webp']
        const maxSize=5*1024*1024
        if(!allowedTypes.includes(file.type))
        {
            toast.error("Invalid type.Only JPEG,PNG,GIF AND WebP are allowed")
            return false
        }
        if(file.size>maxSize)
        {
            toast.error("File size too large.Maximum size is 5MB")
            return false
        }
        return true
    }
    export const scanFile=async(file:File):Promise<boolean>=>{
        try {
            const arrayBuffer=await file.arrayBuffer()
            const bytes=new Uint8Array(arrayBuffer)
            const suspiciousPatterns=[
                [0x4D, 0x5A], 
                [0x7F, 0x45, 0x4C, 0x46],
            ]
            for(const pattern of suspiciousPatterns)
            {
                let match=true
                for(let i=0;i<pattern.length;i++)
                {
                    if(bytes[i]!==pattern[i])
                    {
                        match=false
                        break
                    }
                }
                if(match)
                {
                    toast.error("Potentially malicious file detected")
                    return false
                }
            }
            return true
        } catch (error) {
            toast.error("Error scanning for malware")
            return false
        }
    }
    export const useRateLimit=()=>{
        const [lastPostTime,setLastPostTime]=useState<number>(0)
        const COOLDOWN_PERIOD=60000
        const checkRateLimit=():boolean=>{
            const now=Date.now()
            if(now-lastPostTime<COOLDOWN_PERIOD)
            {
                toast.error(`Please wait ${Math.ceil((COOLDOWN_PERIOD - (now - lastPostTime)) / 1000)} seconds before posting again`);
                return false
            }
            setLastPostTime(now)
            return true
        }
        return checkRateLimit
    }