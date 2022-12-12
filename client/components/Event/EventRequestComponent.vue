<!-- Reusable component representing a single event and its actions -->

<template>
  <article class="event">

    <!-- START INFO HERE  -->
    <table cellspacing="0" cellpadding="0">
      <tr align="left" width="9000000">
        <th rowspan="1" style="font-size:2vw" width="400"> Title will go here</th>

        <td rowspan="2">
        <textarea
            v-if="editing"
            class="startdate"
            :value="draftstart"
            @input="draftstart = $event.target.value"
        />
          <p v-else class="startdate" style="font-size:1.1vw"><b><i>Starts:</i></b> {{ this.dateFormat(event.startdate) }}</p>

          <textarea
              v-if="editing"
              class="enddate"
              :value="draftend"
              @input="draftend = $event.target.value"
          />
          <p v-else class="enddate" style="font-size:1.1vw"><b><i>Ends:</i></b> {{ this.dateFormat(event.enddate) }}</p>

          <textarea
              v-if="editing"
              class="donationdate"
              :value="draftdonation"
              @input="draftdonation = $event.target.value"
          />
          <p v-else class="donationdate" style="font-size:1.1vw">
            <b><i>Last Date for Donations:</i></b> {{ this.dateFormat(event.donationdate) }}
          </p>

        </td>

        <td rowspan="5">
          PICTURES WILL GO DOWN THIS COLUMN
        </td>
      </tr>

      <tr>
        <th rowspan="1" align="left"> Coordinated by @{{ event.coordinatorId }}</th>
      </tr>

      <tr>
        <td colspan="1" align="left">
        <textarea
            v-if="editing"
            class="location"
            :value="draftlocation"
            @input="draftlocation = $event.target.value"
        />
          <div v-else style="text-transform:capitalize;font-size:1.1vw">
            <p class="location"><b>Location:</b> {{ this.locFormat(event.location) }}</p>
          </div>
        </td>

        <td colspan="1" align="left">
        <textarea
            v-if="editing"
            class="contact"
            :value="draftcontact"
            @input="draftcontact = $event.target.value"
        />
          <p v-else class="contact" style="font-size:1.1vw"><b>💌 Contact {{ event.coordinatorId }}:</b> {{ event.contact }}</p>
        </td>
      </tr>

      <!-- TODO: ADD IF FOR RSVP FORM SUPPLIED -->
      <!--
      <tr>
        <td colspan="3" align="left">
        <textarea
            v-if="editing"
            class="rsvp"
            :value="draftrsvp"
            @input="draftrsvp = $event.target.value"
        />
          <p v-else class="description" style="font-size:1.1vw"><b>RSVP Site:</b> FIELD WILL GO HERE</p>
        </td>
      </tr>
      -->

      <tr>
        <td colspan="3" align="left">
        <textarea
            v-if="editing"
            class="description"
            :value="draftdescription"
            @input="draftdescription = $event.target.value"
        />
          <p v-else class="description"><b>📃 Request Description:</b> {{ event.description }}</p>
        </td>
      </tr>

    </table>
    <!-- END INFO HERE  -->

    <section v-if="$store.state.username">
      <div v-if="$store.state.username === event.coordinatorId" class="actions">
        <button v-if="editing" @click="submitEdit">✅ Save changes</button>
        <button v-if="editing" @click="stopEditing">🚫 Discard changes</button>
        <button v-if="!editing" @click="startEditing">✏️ Edit</button>
        <button @click="deleteEvent">🗑️ Delete</button>
      </div>
      <div v-if="this.responding">
        <button @click="submitResponse">Submit</button>
      </div>
      <div>
        <button @click="viewEventResponses">
          👀 View Responses
        </button>
        <button @click="initResponse">🗣 Respond</button>
      </div>
      <section v-if="viewingEventResponses">
        <div v-if="eventResponses.length>0">
          <EventResponseComponent
              v-for="eventResponse in eventResponses"
              :key="eventResponse.id"
              :eventResponse="eventResponse"
          />
        </div>
        <article v-else>
          <h3>No event responses found.</h3>
        </article>
      </section>
      <div v-if="this.responding">
        Response Contact:
        <textarea
            class="responsecontact"
            :value="draftresponsecontact"
            @input="draftresponsecontact = $event.target.value"
        />

        Response Description:
        <textarea
            class="responsedescription"
            :value="draftresponsedescription"
            @input="draftresponsedescription = $event.target.value"
        />

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
                <img class="preview" height="268" width="356" :src="img1"/>
                <br/>
              </div>
            </div>
          </v-flex>
        </v-layout>
        <button @click="submitResponse">
          🗣 Submit Response
        </button>
      </div>
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
import firebase from "firebase/compat/app";
import {getStorage, uploadBytes, ref, getDownloadURL} from "firebase/storage";
import EventResponseComponent from "../EventResponse/EventResponseComponent";

export default {
  name: "EventRequestComponent",
  components: {
    EventResponseComponent,
  },
  props: {
    // Data from the stored request
    event: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      editing: false, // Whether or not this request is in edit mode
      responding: false,
      draftstart: this.event.startdate,
      draftend: this.event.enddate,
      draftdonation: this.event.donationdate,
      draftlocation: this.event.location,
      draftcontact: this.event.contact, // Potentially-new contact for this request
      draftdescription: this.event.description, // Potentially-new description for this request
      draftresponsecontact: "",
      draftresponsedescription: "",
      draftrsvp: "",
      eventResponses: [],
      viewingEventResponses: false,
      alerts: {}, // Displays success/error messages encountered during request modification
      caption: "",
      imageUrl: "",
      imageDate: "",
    };
  },
  methods: {
    dateFormat(str){
      const spl = str.split(",");
      return spl[0];
    },
    locFormat(str){
      const location = str.split(",");
      var city = location[0];
      var st = location[1];
      city = city.charAt(0).toUpperCase() + city.substr(1).toLowerCase();
      st = st.toUpperCase();
      return city.concat(", ", st);
    },
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
      console.log("on upload");
      const storage = getStorage();

      const imgRef = ref(storage, `images/${this.imageData.name}`);
      try {
        const snapshot = await uploadBytes(imgRef, this.imageData);
        const url = await getDownloadURL(snapshot.ref);
        this.imageUrl = url;
        console.log(this.imageUrl);
        console.log(snapshot);
      } catch (error) {
        // Handle errors.
      }
    },
    startEditing() {
      /**
       * Enables edit mode on this request.
       */
      this.editing = true; // Keeps track of if a request is being edited
      this.draftcontact = this.event.contact; // The contact of our current "draft" while being edited
      this.draftdescription = this.event.description; // The description of our current "draft" while being edited
      this.draftstart = this.event.startdate;
      this.draftend = this.event.enddate;
      this.draftdonation = this.event.donationdate;
      this.draftlocation = this.event.location;
    },
    stopEditing() {
      /**
       * Disables edit mode on this request.
       */
      this.editing = false;
      this.draftcontact = this.event.contact;
      this.draftdescription = this.event.description;
      this.draftstart = this.event.startdate;
      this.draftend = this.event.enddate;
      this.draftdonation = this.event.donationdate;
      this.draftlocation = this.event.location;
    },
    deleteEvent() {
      /**
       * Deletes this event.
       */
      const params = {
        method: "DELETE",
        callback: () => {
          this.$store.commit("alert", {
            message: "Successfully deleted event!",
            status: "success",
          });
        },
      };
      this.event(params);
    },
    submitEdit() {
      /**
       * Updates event to have the submitted draft content.
       */
      if (
          this.event.contact === this.draftcontact &&
          this.event.description === this.draftdescription &&
          this.event.startdate === this.draftstart &&
          this.event.enddate === this.draftend &&
          this.event.location === this.draftlocation &&
          this.event.donationdate === this.draftdonation
      ) {
        const error =
            "Error: Edited event content should be different than current event content.";
        this.$set(this.alerts, error, "error"); // Set an alert to be the error text, timeout of 3000 ms
        setTimeout(() => this.$delete(this.alerts, error), 3000);
        return;
      }

      const params = {
        method: "PATCH",
        message: "Successfully edited request!",
        body: JSON.stringify({
          contact: this.draftcontact,
          description: this.draftdescription,
          startdate: this.draftstart,
          enddate: this.draftend,
          location: this.draftlocation,
          donationdate: this.draftdonation,
        }),
        callback: () => {
          this.$set(this.alerts, params.message, "success");
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        },
      };
      this.request(params);
    },
    async viewEventResponses() {
      this.viewingEventResponses = !this.viewingEventResponses;
      const url = `/api/eventResponses/${this.event._id}`; // Get the request ID
      const res = await fetch(url).then(async r => r.json());
      this.eventResponses = res;
    },
    async request(params) {
      /**
       * Submits a request to the request's endpoint
       * @param params - Options for the request
       * @param params.body - Body for the request, if it exists
       * @param params.callback - Function to run if the the request succeeds
       */
      const options = {
        method: params.method,
        headers: {"Content-Type": "application/json"},
      };
      if (params.body) {
        options.body = params.body;
      }

      try {
        const r = await fetch(`/api/events/${this.event._id}`, options);
        const res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }

        this.editing = false;
        //this.$store.commit("updateEvents", res);
        this.$store.commit("refreshEvents");

        params.callback();
      } catch (e) {
        this.$set(this.alerts, e, "error");
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
    initResponse() {
      this.responding = !this.responding;
    },
    async submitResponse() {
      await this.onUpload(); 
      const params = {
        method: "POST",
        message: "Successfully created an event response!",
        body: JSON.stringify({
          contact: this.draftresponsecontact,
          description: this.draftresponsedescription,
          imageURL: this.imageUrl
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
        headers: {"Content-Type": "application/json"},
      };
      if (params.body) {
        options.body = params.body;
      }

      try {
        const r = await fetch(`/api/eventResponses/${this.event._id}`, options);
        const res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }

        this.responding = false;
        //this.$store.commit('updateEventResponses', res);
        this.$store.commit("refreshEventResponses");

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
.event {
  border: 1px solid #111;
  padding: 20px;
  position: relative;
  border-radius: 15px;
  margin-bottom: 15px;
}
</style>
