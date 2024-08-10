declare module 'js-cookie' {
    interface CookiesStatic<T = {}> {
        get(name: string): string | undefined;
        getJSON(name: string): any;
        set(name: string, value: string | object, options?: Cookies.CookieAttributes): CookiesStatic<T>;
        remove(name: string, options?: Cookies.CookieAttributes): void;
    }

    const Cookies: CookiesStatic;
    export default Cookies;
}