<!-- Page for account settings and management -->
<!-- User should be authenticated in order to see this page -->

<template>
  <main>
    <section>
      <header>
        <h2> Active Events, Requests, and Responses for @{{ $store.state.username }}</h2>
      </header>
    </section>
    <section>
      <header>
        <h2>Events</h2>
      </header>
      <div class="right">
        <GetEventsFormBlank
          ref="getEventsFormBlank"
          button="🔄 Get events"
        />
      </div>
      <section v-if="$store.state.events.length">
        <EventComponent
          v-for="event in $store.state.events"
          v-if="event.coordinatorId === $store.state.username"
          :key="event.id"
          :event="event"
        />
      </section>
      <article v-else>
        <h3>No events found.</h3>
      </article>
    </section>

    <section>
      <header>
        <h2>Requests</h2>
      </header>
      <section v-if="$store.state.requests.length">
        <RequestComponent
          v-for="request in $store.state.requests"
          v-if="request.author === $store.state.username"
          :key="request.id"
          :request="request"
        />
      </section>
      <article v-else>
        <h3>No requests found.</h3>
      </article>
    </section>
    
    <section>
      <header>
        <h2>Responses</h2>
      </header>
      <div class="right">
        <GetEventResponsesForm
          ref="getEventResponsesForm"
          button="🔄 Get responses"
        />
      </div>
      <section v-if="$store.state.eventResponses.length">
        <EventResponseComponent
          v-for="response in $store.state.eventResponses"
          v-if="response.author === $store.state.username"
          :key="response.id"
          :eventResponse="response"
        />
      </section>
      <article v-else>
        <h3>No responses found.</h3>
      </article>
    </section>

  </main>
</template>

<script>
import EventComponent from "@/components/Event/EventComponent.vue";
import RequestComponent from "@/components/Request/RequestComponent.vue";
import EventResponseComponent from "@/components/EventResponse/EventResponseComponent.vue";
import GetEventsFormBlank from "@/components/Event/GetEventsFormBlank.vue";
import GetEventResponsesForm from "@/components/EventResponse/GetEventResponsesForm.vue";

export default {
  name: "ProfilePage",
  components: { EventComponent, RequestComponent, EventResponseComponent, GetEventsFormBlank, GetEventResponsesForm },
  mounted() {
    this.$refs.getEventsFormBlank.submit();
    this.$refs.getEventResponsesForm.submit();
  },
};
</script>
