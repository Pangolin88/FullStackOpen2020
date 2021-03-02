import Utils from "../server/extras/Utils";

const departments = ['gt'];

Promise.all(departments.map(async department => (JSON.stringify({ name: department, token: await Utils.createToken('department', department)}))))
    .then(items => {
        Utils.writeArrayToFile('../access-token.json', items)
    })
