<!-- Reusable component representing a single request and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article
    class="request"
  >
    <header>
      <h3 class="requestor">
        @{{ request.requestor }}
      </h3>
      <div
        v-if="$store.state.username === request.requestor"
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
    </header>
    <textarea
      v-if="editing"
      class="contact"
      :value="draftcontact"
      @input="draftcontact = $event.target.value"
    />
    <p
      v-else
      class="contact"
    >
      {{ request.contact }}
    </p>
    <textarea
      v-if="editing"
      class="description"
      :value="draftdescription"
      @input="draftdescription = $event.target.value"
    />
    <p
      v-else
      class="description"
    >
      {{ request.description }}
    </p>
    <textarea
      v-if="editing"
      class="startdate"
      :value="draftstart"
      @input="draftstart = $event.target.value"
    />
    <p
      v-else
      class="startdate"
    >
      {{ request.startdate }}
    </p>
    <textarea
      v-if="editing"
      class="enddate"
      :value="draftend"
      @input="draftend = $event.target.value"
    />
    <p
      v-else
      class="enddate"
    >
      {{ request.enddate }}
    </p>
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
  name: 'RequestComponent',
  props: {
    // Data from the stored request
    request: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      editing: false, // Whether or not this request is in edit mode
      draftcontact: this.request.contact, // Potentially-new contact for this request
      draftdescription: this.request.description, // Potentially-new description for this request
      draftstart: this.request.startdate, // Potentially-new start date for this request
      draftend: this.request.enddate, // Potentially-new end date for this request
      alerts: {} // Displays success/error messages encountered during request modification
    };
  },
  methods: {
    startEditing() {
      /**
       * Enables edit mode on this request.
       */
      this.editing = true; // Keeps track of if a request is being edited
      this.draftcontact = this.request.contact; // The contact of our current "draft" while being edited
      this.draftdescription = this.request.description; // The description of our current "draft" while being edited
      this.draftstart = this.request.startdate; // The start date of our current "draft" while being edited
      this.draftend = this.request.enddate; // The end date of our current "draft" while being edited
    },
    stopEditing() {
      /**
       * Disables edit mode on this request.
       */
      this.editing = false;
      this.draftcontact = this.request.contact;
      this.draftdescription = this.request.description; 
      this.draftstart = this.request.startdate; 
      this.draftend = this.request.enddate; 
    },
    deleteRequest() {
      /**
       * Deletes this request.
       */
      const params = {
        method: 'DELETE',
        callback: () => {
          this.$store.commit('alert', {
            message: 'Successfully deleted request!', status: 'success'
          });
        }
      };
      this.request(params);
    },
    submitEdit() {
      /**
       * Updates request to have the submitted draft content.
       */
      if ((this.request.contact === this.draftcontact) && (this.request.description === this.draftdescription)
        && (this.request.startdate === this.draftstart) && (this.request.enddate === this.draftend)) {
        const error = 'Error: Edited request content should be different than current request content.';
        this.$set(this.alerts, error, 'error'); // Set an alert to be the error text, timeout of 3000 ms
        setTimeout(() => this.$delete(this.alerts, error), 3000);
        return;
      }

      const params = {
        method: 'PATCH',
        message: 'Successfully edited request!',
        body: JSON.stringify({contact: this.draftcontact, description: this.draftdescription, startdate: this.draftstart, enddate: this.draftend}),
        callback: () => {
          this.$set(this.alerts, params.message, 'success');
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        }
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
        method: params.method, headers: {'Content-Type': 'application/json'}
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
        this.$store.commit('refreshRequests');

        params.callback();
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  }
};
</script>

<style scoped>
.request {
    border: 1px solid #111;
    padding: 20px;
    position: relative;
}
</style>
