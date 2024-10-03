const MainModel = require('../models/settings_model')

class SettingService {


    getAllSetting = async () => {
        let id = '66f783b8223c9ab38ff2778d'
        return await MainModel.findById(id)
    }

    update = async (data) => {
        let id = '66f783b8223c9ab38ff2778d'
        return await MainModel.findByIdAndUpdate(id,{name : data})
    }

    //frontend
    findIdAndChangeInfo = async () => {
        let id = '66f783b8223c9ab38ff2778d'
        return await MainModel.findById(id)
    }

}

module.exports = new SettingService()