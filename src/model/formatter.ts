import IconPool from "sap/ui/core/IconPool";

export default {
    textMissing(text: string): string {
        return !!text && text || 'חסר'
    },
    textMissingParts(text: string, text2: string): string {
        return !!text && `${text} ${text2}` || 'חסר'
    },
    accessImage(accessType: string) {
        switch (accessType) {
            case 'forklift':
                return '../images/forklift.png';
            case 'melaket':
                return '../images/melaket.png';
            case 'ladder':
                return '../images/melaket.png';

        }
    },
    accessDesc(accessType: string) {
        switch (accessType) {
            case 'forklift':
                return 'מלגזה';
            case 'melaket':
                return 'מלקטת';
            case 'ladder':
                return 'סולם';

        }
    },
    getIconForMimeType(sMimeType: string) {
        return IconPool.getIconForMimeType(sMimeType)
    },
}