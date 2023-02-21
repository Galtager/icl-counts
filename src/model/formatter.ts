export default {
    textMissing(text: string): string {
        return !!text && text || 'חסר'
    },
    textMissingParts(text: string, text2: string): string {
        return !!text && `${text} ${text2}` || 'חסר'
    },


}