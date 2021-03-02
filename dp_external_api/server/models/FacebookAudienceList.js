import mongoose from 'mongoose';
import {ACTION_TYPE, STATUS_JOB_LIST} from '../config';


const facebookAudienceList = mongoose.Schema({
    // _id: {type: String, default: Utils.generateModelId()},
    creator: {type: String, default: '', trim: true},
    maskedType: {type: String, default: ''},  // which should be unmasked:  deviceId, email or phone
    storedFileName: {type: String, default: ''}, // stored file name which includes masked identities list

    countReceived: {type: Number, default: 0}, // from DAL
    countValid: {type: Number, default: 0}, // will be pushed to FB

    facebookAudienceListName: {type: String, default: ''}, // audience list name will be created in Facebook
    facebookType: {type: String, default: ''}, // fb_audience_list / fb_analytic
    facebookAudienceListId: {type: String, default: ''}, // audience list id from FB
    facebookAdAccountId: {type: String, default: ''}, // FB ad account id

    businessId: {type: String, default: ''}, // PG3, GS2...
    dalCallback: {type: String, default: ''}, // callback to DAL system when submitting to FB done

    preview: [{type: String, default: []}], // callback to DAL system when submitting to FB done

    status: {type: String, default: STATUS_JOB_LIST.INIT},
    created_date: {type: Date},
    actionType: {type: String, default: ACTION_TYPE.CREATE}
}, {collection: 'facebook_audience_list'});


// facebookAudienceList.virtual('id').get(function (){
//     return this._id.toString();
// });
//
//
facebookAudienceList.statics.findByListId = function (listId, status, callback) {
    return this.findOne({storedFileName: listId, status: status}).then(callback);
};

facebookAudienceList.set('toJSON', {virtuals: true});
module.exports = mongoose.model('FacebookAudienceList', facebookAudienceList);

