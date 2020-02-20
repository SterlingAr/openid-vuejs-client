import {BasicQueryStringUtils, LocationLike, StringMap} from "@openid/appauth";
/* eslint-disable */
export class NoHashQueryStringUtils extends BasicQueryStringUtils
{
    parse(input: LocationLike, useHash?: boolean): StringMap
    {
        // console.log(useHash)
        return super.parse(input, false /* never use hash */);
    }
}
