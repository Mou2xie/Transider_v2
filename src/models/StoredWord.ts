// class for word info which should be stored in / remove from local storage

import localforage from "localforage";

class StoredWord {

    constructor(
        public word: string,
        public sentence: string,
        public articleURL: string,
        public timestamp: Date = new Date()
    ) { }

    async addWord() {
        try {
            if (!(await StoredWord.checkIfWordExists(this.word))) {
                this.timestamp = new Date();
                await localforage.setItem(this.word, this);
            }
        } catch (error) {
            console.error('Failed to add word to local storage:', error);
            throw error;
        }
    }

    static async removeWord(word: string) {
        try {
            await localforage.removeItem(word);
        } catch (error) {
            console.error('Failed to remove word from local storage:', error);
            throw error;
        }
    }

    static async checkIfWordExists(word: string): Promise<boolean> {
        try {
            const data = await localforage.getItem<StoredWord>(word);
            return !!data;
        } catch (error) {
            console.error('Failed to check if word exists in local storage:', error);
            return false;
        }
    }
}

export { StoredWord };