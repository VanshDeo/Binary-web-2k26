import React from 'react'
import { pixelifySans } from '@/app/utils/pixelifySans.utils';


const ComingSoon = () => {
    return (
        <div className="flex items-center justify-center min-h-20 md:min-h-50">
            <p className={`text-4xl md:text-4xl font-bold text-white uppercase tracking-widest ${pixelifySans.className}`}>
                Coming Soon!
            </p>
        </div>
    )
}

export default ComingSoon