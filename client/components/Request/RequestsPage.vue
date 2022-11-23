<!-- Default page that also displays requests -->

<template>
  <main>
    <section v-if="$store.state.username">
      <header>
        <h2>Welcome @{{ $store.state.username }}</h2>
      </header>
      <CreateRequestForm />
    </section>
    <section v-else>
      <header>
        <h2>Welcome to Re-Thrift!</h2>
      </header>
      <article>
        <h3>
          <router-link to="/login"> Sign in </router-link>
          to create events and requests, or respond to donations.
        </h3>
      </article>
    </section>
    <section>
      <header>
        <div class="left">
          <h2>
            Viewing all requests
            <span v-if="$store.state.filter">
              by @{{ $store.state.filter }}
            </span>
          </h2>
        </div>
        <div class="right">
          <GetRequestsForm
            ref="getRequestsForm"
            value="requestor"
            placeholder="🔍 Filter by requestor (optional)"
            button="🔄 Get requests"
          />
        </div>
      </header>
      <section v-if="$store.state.requests.length">
        <RequestComponent
          v-for="request in $store.state.requests"
          :key="request.id"
          :request="request"
        />
      </section>
      <article v-else>
        <h3>No requests found.</h3>
      </article>
    </section>
  </main>
</template>

<script>
import RequestComponent from "@/components/Request/RequestComponent.vue";
import CreateRequestForm from "@/components/Request/CreateRequestForm.vue";
import GetRequestForm from "@/components/Request/GetRequestForm.vue";

export default {
  name: "RequestsPage",
  components: { RequestComponent, GetRequestsForm, CreateRequestForm },
  mounted() {
    this.$refs.getRequestsForm.submit();
  },
};
</script>

<style scoped>
section {
  display: flex;
  flex-direction: column;
}

header,
header > * {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

button {
  margin-right: 10px;
}

section .scrollbox {
  flex: 1 0 50vh;
  padding: 3%;
  overflow-y: scroll;
}
</style>
