import React from 'react';
import CountUp from 'react-countup';

function AnimatedCounter({ end, duration = 2, prefix = '', suffix = '' }) {
    return (
        <CountUp
            start={0}
            end={end}
            duration={duration}
            separator=","
            decimals={0}
            prefix={prefix}
            suffix={suffix}
        />
    );
}

export default AnimatedCounter;
