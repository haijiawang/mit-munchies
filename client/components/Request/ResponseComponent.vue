<!-- Form for creating responses (block style) -->

<template>
  <article class="response">
    <textarea
      v-if="editing"
      class="contact"
      :value="draftContact"
      @input="draftContact = $event.target.value"
    />
    <p v-else class="contact">Contact me: {{ response.contact }}</p>
    <textarea
      v-if="editing"
      class="description"
      :value="draftDescription"
      @input="draftDescription = $event.target.value"
    />
    <p v-else class="description">
      Response Description: {{ response.description }}
    </p>
    <img v-if="response.imageURL" :src="response.imageURL" width="200" height="200" />
    <div>
      <div v-if="$store.state.username === response.author" class="actions">
        <button v-if="editing" @click="submitEdit">✅ Save changes</button>
        <button v-if="editing" @click="stopEditing">🚫 Discard changes</button>
        <button v-if="!editing" @click="startEditing">✏️ Edit</button>
        <button @click="deleteResponse">🗑️ Delete</button>
      </div>
    </div>
  </article>
</template>

<script>
import BlockForm from "../common/BlockForm";
import InlineForm from "../common/InlineForm";
import CreateResponseForm from "./CreateResponseForm";

export default {
  name: "ResponseComponent",
  components: { CreateResponseForm, InlineForm, BlockForm },
  props: {
    // Data from the stored response
    response: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      viewingResponses: false,
      responding: false,
      editing: false, // Whether or not this response is in edit mode
      draftContact: this.response.contact, // Potentially-new contact for this response
      draftDescription: this.response.description, // Potentially-new description for this response
      alerts: {}, // Displays success/error messages encountered during response modification
    };
  },
  methods: {
    startEditing() {
      /**
       * Enables edit mode on this response.
       */
      this.editing = true; // Keeps track of if a response is being edited
      this.draftContact = this.response.contact; // The contact of our current "draft" while being edited
      this.draftDescription = this.response.description; // The description of our current "draft" while being edited
    },
    stopEditing() {
      /**
       * Disables edit mode on this response.
       */
      this.editing = false;
      this.draftContact = this.response.contact;
      this.draftDescription = this.response.description;
    },
    deleteResponse() {
      /**
       * Deletes this response.
       */
      const params = {
        method: "DELETE",
        callback: () => {
          this.$store.commit("alert", {
            message: "Successfully deleted response!",
            status: "success",
          });
        },
      };
      this.submitResponse(params);
    },
    submitEdit() {
      /**
       * Updates response to have the submitted draft content.
       */
      if (
        this.response.contact === this.draftContact &&
        this.response.description === this.draftDescription
      ) {
        const error =
          "Error: Edited response content should be different than current response content.";
        this.$set(this.alerts, error, "error"); // Set an alert to be the error text, timeout of 3000 ms
        setTimeout(() => this.$delete(this.alerts, error), 3000);
        return;
      }

      const params = {
        method: "PATCH",
        message: "Successfully edited response!",
        body: JSON.stringify({
          contact: this.draftContact,
          description: this.draftDescription,
        }),
        callback: () => {
          this.$set(this.alerts, params.message, "success");
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        },
      };
      this.submitResponse(params);
    },
    async submitResponse(params) {
      /**
       * Submits a response to the response's endpoint
       * @param params - Options for the response
       * @param params.body - Body for the response, if it exists
       * @param params.callback - Function to run if the the response succeeds
       */
      const options = {
        method: params.method,
        headers: { "Content-Type": "application/json" },
      };
      if (params.body) {
        options.body = params.body;
      }

      try {
        const r = await fetch(
          `/api/responses/${this.$store.state.requestId}`,
          options
        );
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        this.editing = false;
        this.$store.commit("refreshResponses");

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
.response {
  border: 1px solid #111;
  padding: 20px;
  position: relative;
}
</style>
