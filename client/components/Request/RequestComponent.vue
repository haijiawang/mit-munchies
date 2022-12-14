<!-- Reusable component representing a single request and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article class="request">
    <h3 class="author">@{{ request.author }}</h3>

    <table cellpadding="5">
      <tr>
        <td>
          <textarea
              v-if="editing"
              class="contact"
              :value="draftContact"
              @input="draftContact = $event.target.value"
          />
          <div v-else class="field">
            <p class="fieldTitle">💌 Contact me: </p>
            <p class="fieldValue">{{ request.contact }}</p>
          </div>
          <div></div>
        </td>

        <td>
          <textarea
              v-if="editing"
              class="color"
              :value="draftColor"
              @input="draftColor = $event.target.value"
          />
          <div v-else class="field">
            <p class="fieldTitle"> 🎨 Color: </p>
            <p class="fieldValue">{{ request.color }}</p>
          </div>
        <div></div>
        </td>

        <td>
          <textarea
              v-if="editing"
              class="size"
              :value="draftSize"
              @input="draftSize = $event.target.value"
          />
          <div v-else class="field">
            <p class="fieldTitle">👕 Size: </p>
            <p class="fieldValue">{{ request.size }}</p>
          </div>
          <p v-else class="size">Size: {{ request.size }}</p>
        </td>
      </tr>
      <tr>
        <td colspan="3">
          <textarea
              v-if="editing"
              class="description"
              :value="draftDescription"
              @input="draftDescription = $event.target.value"
          />
          <div v-else class="field">
            <p class="fieldTitle"> 📃 Request Description: </p>
            <p class="fieldValue">{{ request.description }}</p>
          </div>
          <div></div>
        </td>
      </tr>
    </table>

    <div>
      <div
          class="actions"
      >
        <button @click="viewResponses">
          👀 View Responses
        </button>
        <button @click="respondToRequest">
          🗣 Respond
        </button>
      </div>
      <div
          v-if="$store.state.username === request.author"
          class="actions"
      >
        <button
            v-if="editing"
            @click="submitEdit"
        >
          ✅ Save changes
        </button>
        <button
            v-if="editing"
            @click="stopEditing"
        >
          🚫 Discard changes
        </button>
        <button
            v-if="!editing"
            @click="startEditing"
        >
          ✏️ Edit
        </button>
        <button @click="deleteRequest">
          🗑️ Delete
        </button>
      </div>
      <div v-if="responding">
        Contact for the requestor to reach you:
        <textarea
            class="responsecontact"
            :value="draftresponsecontact"
            @input="draftresponsecontact = $event.target.value"
        />

        </br>

        Description of your donation to this request:
        <textarea
            class="responsedescription"
            :value="draftresponsedescription"
            @input="draftresponsedescription = $event.target.value"
        />

        </br>

        Submit an Image:
        <v-layout row>
          <v-flex md6 offset-sm3>
            <div>
              <div>
                <button @click="click1">Upload Image</button>
                <input
                    type="file"
                    ref="input1"
                    style="display: none"
                    @change="previewImage"
                    accept="image/*"
                />
              </div>

              <div v-if="imageData != null">
                <img v-if="this.imageUrl" class="preview" height="200" width="200" :src="this.imageUrl"/>
                <br/>
              </div>
            </div>
          </v-flex>
        </v-layout>

        <button @click="submitResponse">
          🗣 Submit Response
        </button>
      </div>
    </div>
    <section v-if="viewingResponses">
      <div v-if="responses.length>0">
        <ResponseComponent
            v-for="response in responses"
            :key="response.id"
            :response="response"
        />
      </div>
      <article v-else>
        <h3>No responses found.</h3>
      </article>
    </section>
    <section class="alerts">
      <article
          v-for="(status, alert, index) in alerts"
          :key="index"
          :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>
  </article>
</template>

<script>
import BlockForm from "../common/BlockForm";
import InlineForm from "../common/InlineForm";
import CreateResponseForm from "./CreateResponseForm";
import ResponseComponent from "./ResponseComponent";
import GetRequestsForm from "./GetRequestsForm";

import firebase from "firebase/compat/app";
import { getStorage, uploadBytes, ref, getDownloadURL } from "firebase/storage";

export default {
  name: "RequestComponent",
  components: {
    GetRequestsForm,
    CreateResponseForm,
    ResponseComponent,
    InlineForm,
    BlockForm,
  },
  props: {
    // Data from the stored request
    request: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      viewingResponses: false,
      responding: false,
      editing: false, // Whether or not this request is in edit mode
      draftContact: this.request.contact, // Potentially-new contact for this request
      draftDescription: this.request.description, // Potentially-new description for this request
      draftresponsecontact: "",
      draftresponsedescription: "",
      imageUrl: "",
      imageData: "",
      caption: "",
      img1: "",
      imageDate: null,
      responses: [],
      alerts: {}, // Displays success/error messages encountered during request modification
    };
  },
  methods: {
    create() {
      const post = {
        photo: this.img1,
        caption: this.caption,
      };
      firebase
        .database()
        .ref("PhotoGallery")
        .push(post)
        .then((response) => {
          console.log(response);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    click1() {
      this.$refs.input1.click();
    },

    previewImage(event) {
      this.uploadValue = 0;
      this.img1 = null;
      this.imageData = event.target.files[0];
    },

    async onUpload() {
      const storage = getStorage();

      const imgRef = ref(storage, `images/${this.imageData.name}`);
      try {
        const snapshot = await uploadBytes(imgRef, this.imageData);
        const url = await getDownloadURL(snapshot.ref);
        this.imageUrl = url;
      } catch (error) {
        // Handle errors.
      }
    },
    respondToRequest() {
      /**
       * Enables respond mode on this request.
       */
      this.responding = !this.responding; // Keeps track of if a request is being edited
    },
    async viewResponses() {
      this.viewingResponses = !this.viewingResponses;
      const url = `/api/responses/${this.request._id}`; // Get the request ID
      const res = await fetch(url).then(async (r) => r.json());
      this.responses = res;
    },
    startEditing() {
      /**
       * Enables edit mode on this request.
       */
      this.editing = true; // Keeps track of if a request is being edited
      this.draftContact = this.request.contact; // The contact of our current "draft" while being edited
      this.draftDescription = this.request.description; // The description of our current "draft" while being edited
    },
    stopEditing() {
      /**
       * Disables edit mode on this request.
       */
      this.editing = false;
      this.draftContact = this.request.contact;
      this.draftDescription = this.request.description;
    },
    deleteRequest() {
      /**
       * Deletes this request.
       */
      const params = {
        method: "DELETE",
        callback: () => {
          this.$store.commit("alert", {
            message: "Successfully deleted request!",
            status: "success",
          });
        },
      };
      this.submitRequest(params);
    },
    submitEdit() {
      /**
       * Updates request to have the submitted draft content.
       */
      if (
        this.request.contact === this.draftContact &&
        this.request.description === this.draftDescription
      ) {
        const error =
          "Error: Edited request content should be different than current request content.";
        this.$set(this.alerts, error, "error"); // Set an alert to be the error text, timeout of 3000 ms
        setTimeout(() => this.$delete(this.alerts, error), 3000);
        return;
      }

      const params = {
        method: "PATCH",
        message: "Successfully edited request!",
        body: JSON.stringify({
          contact: this.draftContact,
          description: this.draftDescription,
        }),
        callback: () => {
          this.$set(this.alerts, params.message, "success");
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        },
      };
      this.submitRequest(params);
    },
    async submitRequest(params) {
      /**
       * Submits a request to the request's endpoint
       * @param params - Options for the request
       * @param params.body - Body for the request, if it exists
       * @param params.callback - Function to run if the the request succeeds
       */
      const options = {
        method: params.method,
        headers: { "Content-Type": "application/json" },
      };
      if (params.body) {
        options.body = params.body;
      }

      try {
        const r = await fetch(`/api/requests/${this.request._id}`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        this.editing = false;
        this.$store.commit("refreshRequests");

        params.callback();
      } catch (e) {
        this.$set(this.alerts, e, "error");
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
    async submitResponse() {
      await this.onUpload();
      const params = {
        method: "POST",
        message: "Successfully created a response!",
        body: JSON.stringify({
          contact: this.draftresponsecontact,
          description: this.draftresponsedescription,
          imageURL: this.imageUrl,
        }),
        callback: () => {
          this.$set(this.alerts, params.message, "success");
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        },
      };
      this.responseRequest(params);
    },
    async responseRequest(params) {
      /**
       * Submits a request to the request's endpoint
       * @param params - Options for the request
       * @param params.body - Body for the request, if it exists
       * @param params.callback - Function to run if the the request succeeds
       */
      const options = {
        method: params.method,
        headers: { "Content-Type": "application/json" },
      };
      if (params.body) {
        options.body = params.body;
      }

      try {
        const r = await fetch(`/api/responses/${this.request._id}`, options);
        const res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }

        this.responding = false;
        this.$store.commit("refreshResponses");
        this.$store.commit("updateResponses", this.request._id, res);

        params.callback();
      } catch (e) {
        this.$set(this.alerts, e, "error");
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
  },
};
</script>

<style scoped>
.request {
  border: 1px solid #111;
  padding: 20px;
  position: relative;
  border-radius: 15px;
  margin-bottom: 15px;
}

.request .author {
  font-weight: bold;
}

.request .field {
  display: inline-block;
}

.request .fieldTitle {
  float: left;
  margin-right: 5px;
  margin-bottom: 0px;
  margin-top: 0px;
}

.request .fieldValue {
  float: right;
  font-weight: 200;
  font-style: italic;
  margin-bottom: 0px;
  margin-top: 0px;
}
</style>
