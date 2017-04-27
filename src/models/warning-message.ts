/**
 * Class representing a warning message
 * @class
 * @classdesc If the user makes something wrong regarding nutrition, exercise, sleep, etc. he must be warned
 */
export class WarningMessage {
    /**
     * @constructor
     * @param {string} message - A brief information about what he did wrong
     * @param {string} moreInfo - Detailed information about why it is wrong what he did
     */
    constructor(
        public message: string,
        public moreInfo: string
    ) { }
}