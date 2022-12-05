import {onlyNumberKey} from './shared/utils.js'
const inputDocumentNumber = document.getElementById('input-document-number');
inputDocumentNumber.onkeypress = onlyNumberKey;