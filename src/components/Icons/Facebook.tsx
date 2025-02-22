import React from 'react';

interface FacebookProps {
    classname?: string;
    size?: number;
}

export const Facebook = ({ classname, size = 20 }: FacebookProps) => {
    return (
        <>
            <svg
                width={size}
                height={size}
                className={classname}
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M19.2734 10C19.2734 5.02944 15.244 1 10.2734 1C5.30288 1 1.27344 5.02944 1.27344 10C1.27344 14.4922 4.56461 18.2155 8.86719 18.8906V12.6016H6.58203V10H8.86719V8.01719C8.86719 5.76156 10.2108 4.51562 12.2666 4.51562C13.2513 4.51562 14.2812 4.69141 14.2812 4.69141V6.90625H13.1464C12.0284 6.90625 11.6797 7.6 11.6797 8.31175V10H14.1758L13.7768 12.6016H11.6797V18.8906C15.9823 18.2155 19.2734 14.4922 19.2734 10Z"
                    fill="#3843FF"
                />
                <path
                    d="M13.7768 12.6016L14.1758 10H11.6797V8.31175C11.6797 7.6 12.0284 6.90625 13.1464 6.90625H14.2812V4.69141C14.2812 4.69141 13.2513 4.51562 12.2666 4.51562C10.2108 4.51562 8.86719 5.76156 8.86719 8.01719V10H6.58203V12.6016H8.86719V18.8906C9.79902 19.0365 10.7479 19.0365 11.6797 18.8906V12.6016H13.7768Z"
                    fill="white"
                />
            </svg>
        </>
    );
};
