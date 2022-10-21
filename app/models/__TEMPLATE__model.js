const mongoose = require("mongoose");
const _ = require("lodash");

// export models as functions that attach to dio application when the app starts
module.exports = async ({ dio }) => {
  const config = dio.c.main;
  const DEBUG = dio.f.willShowMainLogger(__filename);
  const MODEL_NAME = "orgs";
  const MODEL_NAMESPACE = config.uuid.namespaces.orgs;

  try {
    // CHECK IF DUPLICATE NAME
    if (!!dio.models[MODEL_NAME])
      throw new Error(`There already is a model with the name '${MODEL_NAME}'`);

    // SCHEMA

    let Schema = new mongoose.Schema(
      {
        uuid: {
          type: String,
          unique: true,
          default: () => dio.f.generateRandomUUIDWithNamespace(MODEL_NAMESPACE),
        },

        // siteName is used in URLs and has to be unique
        siteName: {
          type: String,
          unique: true,
        },
        name: {
          type: String,
          required: true,
        },
      },
      {
        timestamps: true,
        collection: "orgs",
      }
    );

    // PRE SAVE

    Schema.pre('save', async function() {

      // check on each save that the site name is valid
      if (this.isNew || !this.validateSiteName({ siteName: this.siteName })) {
        this.siteName = await this.getSiteNameUpdate(this.siteName);
      }

    });

    // END PRE SAVE

    // VALIDATIONS

    // END VALIDATIONS

    // END SCHEMA

    // INDEXES

    // END INDEXES

    // VIRTUALS

    // END VIRTUALS

    // STATICS

    Schema.statics.getOne = async function({ findObj }) {
      try {

        if (!findObj) throw new Error("no findObj in mdlParams")

        return await this.findOne({ ...findObj });
      }

      catch (err) {
        return err;
      }
    }

    Schema.statics.createNew = async function (mdlParams) {

      try {

        let d = await this.create(mdlParams);

        await d.save();

        return d;

      }

      catch (err) {
        return err;
      }
    };

    // END STATICS

    // INSTANCE METHODS

    Schema.methods.validateSiteName = async function ({ siteName }) {
      try {

        // check there is no other org with this siteName
        let existingorg = await dio.models[MODEL_NAME].getOne({ findObj: { siteName } });
        if (existingorg && existingorg.orguuid !== this.orguuid) return false;

        return true;
      }

      catch (err) {
        return err;
      }
    }

    Schema.methods.getSiteNameUpdate = async function(proposedName) {
      try {

        let result = encodeURIComponent(proposedName || this.siteName?.toLowerCase() || this.name.toLowerCase());

        let isValid = await this.validateSiteName({ siteName: result });
        if (isValid instanceof Error) throw isValid;

        return (
          isValid ?
          result :
          this.getSiteNameUpdate(result + Math.floor(Math.random() * 10))
        );
      }

      catch (err) {
        return err;
      }
    }

    Schema.methods.formatForManagers = async function() {
      try {

        let v = _.cloneDeep(this);

        let res = {
          name: v.name,
          orguuid: v.orguuid,
          siteName: v.siteName
        }

        return res
      }

      catch (err) {
        return err;
      }
    }

    // END METHODS

    let Model = mongoose.model("orgs", Schema);
    dio.models[MODEL_NAME] = Model;
    return DEBUG && dio.l.main.info(`${MODEL_NAME} model attached...`);
  } catch (err) {
    !dio.isRunningTests && dio.l.main.error(`Error when attaching the ${MODEL_NAME} model!`);
    DEBUG && !dio.isRunningTests && dio.l.main.error(err.toString());
  }
};
