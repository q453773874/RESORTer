'use strict';
const Database = use("Database");
const Member = use("App/Models/Member");
const Token = use("App/Models/ValidationToken");
const Mail = use("Mail");
const Encryption = use('Encryption');
const Helpers = use('Helpers');
const fs = require('fs-extra');
const imagePath = "UserPortrait";

/**
 * Deal with Member table
 * create a member - "register"
 * change user active state - "activateUser"
 * Handle email confirmation token expire - "resendConfirmEmail"
 * get profile - "showProfile"
 * edit profile - "editProfile"
 * forget password - "sendResetLinkEmail"
 * reset password - "resetPassword"
 * change password - "changePassword"
 */
class MemberController {

  //Check whether a use has completed profile
  async checkCompleteProfile({request,response,params,auth}){

    try{
      //FIXME: can not do auth.check()
      // await auth.check();
      const userToken = await Token.findBy('Token', params.token);
      const user = await Member.find(userToken.MemberID)

      if(user.IsProfileComplete === 0){

        return response.send(JSON.stringify({status:'fail'}))

      }else if(user.IsProfileComplete === 1){

        return response.send(JSON.stringify({status:'success'}))

      }


    }catch(err){
      console.log(err)
      return response.send(JSON.stringify({status:'Server Error'}))

    }

  }

  //Sign Up Function
  async register({request, auth}) {

    try {
      const requestData = request.all();

      //Use Encryption to encrypt user plain password
      const encrypted = Encryption.encrypt(requestData.registerPassword);
      const userEmail = await Database.table("members")
        .where("Email", requestData.registerEmail)
        .select("Email");

      //email is not exist -> new user
      if (userEmail.length <= 0) {
        const member = new Member();
        member.Email = requestData.registerEmail;
        member.EncryptedPW = encrypted;
        member.IsActive = false;
        member.Provider = requestData.provider;
        await member.save();

        //Generate a JWT to a user that needs confirm email
        let userToken = await auth.generate(member);

        //send confirmation email
        this.sendConfirmationEmail(
          requestData.registerEmail,
          userToken.token,
          member.id
        );

        return JSON.stringify({
          registerEmail: requestData.registerEmail,
          status: "success",
          reason: "success register"
        });

      } else {

        return JSON.stringify({
          registerEmail: requestData.registerEmail,
          status: "fail",
          reason: "Email already exists"
        });

      }
    } catch (err) {

      console.log(err);
      return JSON.stringify({
        status: "fail",
        reason: "Server Error"
      });

    }
  }

  //Activate user's IsActive
  async activateUser({request, auth, response}) {

    try {

      //Identify whether JWT token is expired
      await auth.check();

      const member = await Member.query()
        .where("id", request.input("id"))
        .first();

      //if the user is already activated
      if (member.IsActive === 1) {

        response.send(JSON.stringify({status: "activated"}));

      }

      //If user is not activated
      member.IsActive = true;
      await member.save();

      return JSON.stringify({
        status: "success"
      });

    } catch (error) {

      // display error message
      console.log(error);
      return JSON.stringify({
        status: "fail",
        reason: "token expires"
      });

    }
  }

  //Sending Confirmation Email
  async sendConfirmationEmail(userEmail, token, id) {

    try {
      const mailData = {
        userEmail,  //Member's Email
        token,      //Temporary JWT token
        id          //MemberId
      };

      await Mail.send("auth.emails.confirmationEmail", mailData, message => {
        message
          .to(userEmail)
          .from("resorterapp-test <no-reply@site-members.com>")
          .subject("Email Confirmation");
      });

      console.log("email sent successful");

      return JSON.stringify({
        status: "Email successfully send"
      });

    } catch (error) {
      console.log(error);
    }
  }

  /*
      API:/api/resendConfirmEmail
      request: {'email':EMAIL,'id':id}
      response:{'email':EMAIL, status: 'success/fail'}
  */
  async resendConfirmEmail({request, auth, response}) {
    try {
      let member;
      console.log(request.all());
      //Judge whether request contains Email or Id
      if ("email" in request.all()) {

        member = await Member.findBy("Email", request.input("email"));

      } else if ('id' in request.all()) {

        member = await Member.findBy("id", request.input("id"));

      } else {

        return JSON.stringify({
          status: "fail",
          reason: "INFORMATION LOST: request require email or id."
        });
      }

      let userToken = await auth.generate(member);
      this.sendConfirmationEmail(member.Email, userToken.token, member.id);

      return response.send(
        JSON.stringify({status: "success", email: request.input("email")})
      );

    } catch (err) {

      console.log(err);
      return response.send(JSON.stringify({
        status: "fail",
        reason: "SERVER ERROR: Please Try Again"
      }));

    }
  }

  // Show the user information stored in database
  async showProfile({params}) {
    //token is valid
    try {
      const token = params.token;
      //console.log(token);
      const dbMemberID = await Database.table('validation_tokens')
        .where("Token", token).select('MemberID');

      const member = await Member.findBy('id', dbMemberID[0].MemberID);

      return JSON.stringify({
        email: member.Email,
        gender: member.Gender,
        firstName: member.Firstname,
        lastName: member.Lastname,
        portrait: member.Portrait,
        phoneCode: member.PhoneAreaCode,
        phoneNumber: member.PhoneNumber,
        dob: member.DOB,
        country: member.Country,
        postcode: member.Postcode,
        isDisabled: member.IsDisabled,
        disabilityDetail: member.DisabilityDetail,
        disabilityMembership: member.DisabilityMembership,
        disabilityMembershipId: member.DisabilityMembershipID,
        skiAbility: member.SkiAbility,
        snowboardAbility: member.SnowboardAbility,
        telemarkAbility: member.TelemarkAbility,
        snowbikeAbility: member.SnowbikeAbility,
        snowmobileAbility: member.SnowmobileAbility,
        snowshoeAbility: member.SnowshoeAbility,
      })

    } catch (e) {
      //console.log(e);
    }
  }

  // Update user information and store them into the database
  async editProfile({request, auth}) {

    const requestData = request.all();

    //console.log(requestData)
    //if the user login with email, check token
    if (requestData.provider === "email") {

      try {
        const isTokenValid = await auth.check();
        console.log(isTokenValid);

        const token = requestData.token;

        //console.log(token);
        const dbToken = await Token.findBy("Token", token);
        //console.log(dbToken);
        const member = await Member.findBy('id', dbToken.MemberID);

        const newToken = await auth.generate(member);
        //console.log(newToken);
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
          DisabilityDetail: requestData.DisabilityDetail,
          IsProfileComplete: requestData.IsProfileComplete
        });

        await member.save();

        //console.log(member);
        //console.log("success saved");

        const userName = requestData.FirstName + " " + requestData.LastName;
        //console.log(userName);

        return JSON.stringify({
          token: dbToken.Token,
          name: userName,
          tokenValid: true
        })

      } catch (e) {
        console.log('token expired');
        console.log(e);
        return JSON.stringify({
          tokenValid: false
        });
      }
    }

    //if login with google and facebook
    else {
      const token = requestData.token;
      const dbToken = await Token.findBy("Token", token);
      const member = await Member.findBy('id', dbToken.MemberID);

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
        DisabilityDetail: requestData.DisabilityDetail,
        IsProfileComplete: requestData.IsProfileComplete
      });

      await member.save();

      //console.log(member);
      console.log("success saved");

      const userName = requestData.FirstName + " " + requestData.LastName;

      return JSON.stringify({
        token: dbToken.Token,
        name: userName,
        tokenValid: true
      });
    }

  }

  async updateImage({request}) {

    try {
      const profilePic = request.file('file', {
        types: ['image'],
        size: '15mb'
      });
      //console.log(profilePic);

      const token = request.params.token;
      //console.log(token);
      const dbToken = await Token.findBy("Token", token);
      const fileType = profilePic.subtype;
      //console.log(fileType);
      let fileName = dbToken.MemberID + "-portrait." + fileType;
      //console.log(fileName);
      let filePath = imagePath + "/" + fileName;
      const uploadPath = Helpers.publicPath(imagePath);
      const existedFilePath = Helpers.publicPath(filePath);

      //console.log(existedFilePath);
      //console.log(await fs.pathExists(existedFilePath));

      //if path already exist, remove original file
      if (await fs.pathExists(existedFilePath)) {
        console.log("image already exist");
        await fs.remove(existedFilePath);
      }

      //move the file to the path
      await profilePic.move(uploadPath, {
        name: fileName
      });

      if (!profilePic.moved()) {
        console.log("something is wrong");
        return
      }

      const member = await Member.findBy('id', dbToken.MemberID);
      member.Portrait = filePath;
      await member.save();

      console.log("change image success");

      return JSON.stringify({
        portrait: filePath
      })
    }
    catch (e) {
      console.log(e);
    }

  }

  // Send the reset password link to user's email address
  async sendResetLinkEmail({request, auth}) {
    // validate from inputs
    try {
      const user = await Member.findBy('Email', request.input('email'));

      const dbProvider = await Database.table('members')
        .where("Email", request.input('email')).select('Provider');

      //email does not exist
      if (user == null) {
        console.log("email does not exist");
        return JSON.stringify({
          emailExisted: false
        });
      }

      //email is duplicated
      else if (dbProvider[0].Provider !== "email") {
        console.log("cannot modify social account email");
        return JSON.stringify({
          emailExisted: true,
          emailDuplicated: true,
          duplicatedProvider: dbProvider[0].Provider
        });
      }

      // email is validated
      else {
        const dbActive = await Database.table('members')
          .where("Email", user.Email).select('IsActive');

        //not active account
        if (dbActive[0].IsActive === 0) {
          console.log("email is not activated");
          return JSON.stringify({
            emailExisted: true,
            emailDuplicated: false,
            isActive: false
          });
        } else {
          // generate new token
          const newToken = await auth.generate(user);

          const mailData = {
            user: user.toJSON(),
            token: newToken.token
          };

          // send email to user's email address
          await Mail.send('auth.emails.password_reset', mailData, message => {
            message
              .to(user.Email)
              .from('resorterapp-test <no-reply@site-members.com>')
              .subject('Reset your password')
          });
          console.log("email sent successful");
          return JSON.stringify({
            emailExisted: true
          });
        }
      }

    } catch (error) {
      console.log(error)

    }
  }

  // reset the password of user when user forget the original password
  async resetPassword({request, response, auth}) {

    try {
      const isTokenValid = await auth.check();
      console.log(isTokenValid);
      // get user by the provider token
      const user = await Member.findBy('id', request.input('id'));
      //console.log(user.Email);
      user.EncryptedPW = Encryption.encrypt(request.input('password'));
      await user.save();
      console.log("password reset successful " + Encryption.decrypt(user.EncryptedPW));
      return response.send(JSON.stringify({
          status: 'success'
        })
      )

    }
    catch (error) {
      // display error message
      console.log(error);
      return response.send(JSON.stringify({
          status: 'fail',
          reason: 'token expires'
        })
      )
    }

  }

  // change the password of user with user's original password
  async changePassword({request, auth}) {
    //token is valid
    try {
      const isTokenValid = await auth.check();
      console.log(isTokenValid);

      const requestData = request.all();

      const token = requestData.token;
      const originPwd = requestData.originPwd;
      const newPwd = requestData.newPwd;

      const dbMemberID = await Database.table('validation_tokens')
        .where("Token", token).select('MemberID');

      const dbpwd = await Database.table('members')
        .where("id", dbMemberID[0].MemberID).select('EncryptedPW');

      const decrptpwd = Encryption.decrypt(dbpwd[0].EncryptedPW);

      //wrong password
      if (originPwd !== decrptpwd) {
        console.log("wrong password");
        return JSON.stringify({
          tokenValid: true,
          wrongPwd: true
        });
      }

      //all correct
      else {
        console.log("change password success");

        const member = await Member.findBy('id', dbMemberID[0].MemberID);

        const encrypted = Encryption.encrypt(newPwd);
        member.merge({EncryptedPW: encrypted});
        await member.save();

        const dbToken = await Token.findBy({
          'MemberID': dbMemberID[0].MemberID,
          'Type': "EmailLogin"
        });
        const newToken = await auth.generate(member);
        console.log(newToken);
        //only change token
        dbToken.merge({Token: newToken.token});
        await dbToken.save();

        return JSON.stringify({
          tokenValid: true,
          wrongPwd: false,
          token: dbToken.Token
        })
      }

    } catch (e) {
      console.log('token expired');
      console.log(e);
      return JSON.stringify({
        tokenValid: false
      });
    }
  }

}


module.exports = MemberController;
