<!-- Reusable component representing a single event and its actions -->

<template>
  <article class="event">
    <header>
      <h3 class="coordinator">@{{ event.coordinatorId }}</h3>
      <div v-if="$store.state.username === event.coordinatorId" class="actions">
        <button v-if="editing" @click="submitEdit">✅ Save changes</button>
        <button v-if="editing" @click="stopEditing">🚫 Discard changes</button>
        <button v-if="!editing" @click="startEditing">✏️ Edit</button>
        <button @click="deleteEvent">🗑️ Delete</button>
      </div>
    </header>

    <textarea
      v-if="editing"
      class="description"
      :value="draftdescription"
      @input="draftdescription = $event.target.value"
    />
    <p v-else class="description">Description: {{ event.description }}</p>

    <textarea
      v-if="editing"
      class="startdate"
      :value="draftstart"
      @input="draftstart = $event.target.value"
    />
    <p v-else class="startdate">Event Start: {{ event.startdate }}</p>

    <textarea
      v-if="editing"
      class="enddate"
      :value="draftend"
      @input="draftend = $event.target.value"
    />
    <p v-else class="enddate">Event End: {{ event.enddate }}</p>

    <textarea
      v-if="editing"
      class="donationdate"
      :value="draftdonation"
      @input="draftdonation = $event.target.value"
    />
    <p v-else class="donationdate">
      Last Date for Accepting Donations: {{ event.donationdate }}
    </p>

    <textarea
      v-if="editing"
      class="location"
      :value="draftlocation"
      @input="draftlocation = $event.target.value"
    />
    <p v-else class="location">Location: {{ event.location }}</p>

    <textarea
      v-if="editing"
      class="contact"
      :value="draftcontact"
      @input="draftcontact = $event.target.value"
    />
    <p v-else class="contact">Contact Me: {{ event.contact }}</p>

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
export default {
  name: "EventComponent",
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
      draftstart: this.event.startdate,
      draftend: this.event.enddate,
      draftdonation: this.event.donationdate,
      draftlocation: this.event.location,
      draftcontact: this.event.contact, // Potentially-new contact for this request
      draftdescription: this.event.description, // Potentially-new description for this request
      alerts: {}, // Displays success/error messages encountered during request modification
    };
  },
  methods: {
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
    async request(params) {
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
        const r = await fetch(`/api/events/${this.event._id}`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        this.editing = false;
        this.$store.commit("refreshEvents");

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
