import * as React from "react";

const MOBILE_BREAKPOINT = 768;
const PHONE_BREAKPOINT = 640;

export function useIsMobile() {
    const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
        undefined
    );

    React.useEffect(() => {
        const mql = window.matchMedia(
            `(max-width: ${MOBILE_BREAKPOINT - 1}px)`
        );
        const onChange = () => {
            setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
        };
        mql.addEventListener("change", onChange);
        setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
        return () => mql.removeEventListener("change", onChange);
    }, []);

    return !!isMobile;
}

export function useIsPhone() {
    const [isPhone, setIsPhone] = React.useState<boolean | undefined>(
        undefined
    );

    React.useEffect(() => {
        const mql = window.matchMedia(`(max-width: ${PHONE_BREAKPOINT - 1}px)`);
        const onChange = () => {
            setIsPhone(window.innerWidth < PHONE_BREAKPOINT);
        };
        mql.addEventListener("change", onChange);
        setIsPhone(window.innerWidth < PHONE_BREAKPOINT);
        return () => mql.removeEventListener("change", onChange);
    }, []);

    return !!isPhone;
}
