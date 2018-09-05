'use strict';
const Database = use("Database");
const Member = use("App/Models/Member");
const Token = use("App/Models/ValidationToken");
const Encryption = use("Encryption");

class ProfileController {

  async showProfile({params}) {
        //token is valid
        try {
          const token = params.token;
          console.log(token)
          const dbMemberID = await Database.table('validation_tokens')
            .where("Token", token).select('MemberID');

          // if (dbMemberID[0].Type == "EmailLogin") {
          //   const isTokenValid = await auth.check();
          //   console.log(isTokenValid)
          // }
          //console.log(token)
         
          const member = await Member.findBy('id', dbMemberID[0].MemberID);
          
          // const dbToken = await Token.findBy({
          //     'MemberID': dbMemberID[0].MemberID
          // });

          //   const newToken = await auth.generate(member);
          //   console.log(newToken);
          //   //only change token
          //   dbToken.merge({Token: newToken.token});
          //   await dbToken.save();
    
            return JSON.stringify({
              email: member.Email,
              gender: member.Gender,
              firstname: member.Firstname,
              lastname: member.Lastname,
              phonecode: member.PhoneAreaCode,
              phonenumber: member.PhoneNumber,
              dob: member.DOB,
              country: member.Country,
              postcode: member.Postcode,
              isdisabled: member.IsDisabled,
              disabilitydetail: member.DisabilityDetail,
              disabilitymembership: member.DisabilityMembership,
              disabilitymembershipid: member.DisabilityMembershipID,
              skiability: member.SkiAbility,
              snowboardability: member.SnowboardAbility,
              telemarkability: member.TelemarkAbility,
              snowbikeability: member.SnowbikeAbility,
              snowmobileability: member.SnowmobileAbility,
              snowshoeability: member.SnowshoeAbility,
              portrait: member.Portrait
              //token: dbToken.Token
              //tokenValid: true
            })

        } catch (e) {
          //console.log('token expired');
          console.log(e);
          // return JSON.stringify({
          //   tokenValid: false
          // });
        }
      }

      async addProfile({request, auth}){

        try{

        const requestData = request.all();
        const token = requestData.token;
        const dbToken = await Token.findBy("Token", token);

        if (dbToken.Type == "EmailLogin") {
          const isTokenValid = await auth.check();
          console.log(isTokenValid)
        }
        console.log(token)
        const member = await Member.findBy('id', dbToken.MemberID);

            const newToken = await auth.generate(member);
            console.log(newToken);
            //only change token
            dbToken.merge({Token: newToken.token});
            await dbToken.save();

            member.merge({
              FirstName: requestData.FirstName,
              LastName: requestData.LastName,
              Gender: requestData.Gender,
              DOB: requestData.DOB,
              PhoneAreaCode: requestData.PhoneAreaCode,
              PhoneNumber: requestData.PhoneNumber,
              Country: requestData.Country,
              Postcode: requestData.Postcode,
              SkiAbility: requestData.SkiAbility,
              SnowboardAbility: requestData.SnowboardAbility,
              TelemarkAbility: requestData.TelemarkAbility,
              SnowbikeAbility: requestData.SnowbikeAbility,
              SnowmobileAbility: requestData.SnowmobileAbility,
              SnowshoeAbility: requestData.SnowshoeAbility,
              IsDisabled: requestData.IsDisabled,
              DisabilityMembership: requestData.DisabilityMembership,
              DisabilityMembershipID: requestData.DisabilityMembershipID,
              DisabilityDetail: requestData.DisabilityDetail
            });

          await member.save();

          console.log(member)
          console.log("success saved")

          return JSON.stringify({
            token: dbToken.Token,
            tokenValid: true
          })

        }catch(e){
          console.log('token expired');
          console.log(e);
          return JSON.stringify({
            tokenValid: false
          });
        }
      }
}

module.exports = ProfileController;