<!-- Page for account settings and management -->
<!-- User should be authenticated in order to see this page -->

<template>
  <main>
    <section>
      <header>
        <h2>
          @{{
            $store.state.username
          }}'s donation requests and events
        </h2>
      </header>
    </section>
    <div class="pageIntroduction">
        Welcome to your profile page! Here you can find the all the events you have hosted and requests you have made.
    </div>

    <!--
    <GetProfileForm
      ref="getProfileForm"
      value="$store.state.username"
    />
    <div>
        Your Location: {{ $store.state.userlocation }}
    </div>
    <div>
      Your Contact: {{ $store.state.usercontact }}
    </div>
    <div>
      Date Joined: {{ $store.state.userDateJoined }}
    </div>
    -->

    <section>
      <div class="right">
        <GetEventsFormBlank
          ref="getEventsFormBlank"
          value="$store.state.username"
        />
      </div>
      <header>
        <h2>Events: You have {{ $store.state.events.length }} event(s) active. </h2>
      </header>
      <section v-if="$store.state.events.length">
        <EventRequestComponent
          v-for="event in $store.state.events"
          :key="event.id"
          :event="event"
        />
      </section>
      <article v-else>
        <h3>No events found.</h3>
      </article>
    </section>

    <section>
      <div class="right">
        <GetRequestsFormBlank
          ref="getRequestsFormBlank"
          value="$store.state.username"
        />
      </div>
      <header>
        <h2>Requests: You have {{ $store.state.requests.length }} request(s) active. </h2>
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
import EventRequestComponent from "@/components/Event/EventRequestComponent.vue";
import RequestComponent from "@/components/Request/RequestComponent.vue";
import EventResponseComponent from "@/components/EventResponse/EventResponseComponent.vue";
import GetEventsFormBlank from "@/components/Event/GetEventsFormBlank.vue";
import GetRequestsFormBlank from "@/components/Request/GetRequestsFormBlank.vue";
import GetEventResponsesForm from "@/components/EventResponse/GetEventResponsesForm.vue";
import GetProfileForm from "@/components/Profile/GetProfileForm.vue";

export default {
  name: "ProfilePage",
  components: {
    EventRequestComponent,
    RequestComponent,
    EventResponseComponent,
    GetEventsFormBlank,
    GetRequestsFormBlank,
    GetEventResponsesForm,
    GetProfileForm,
  },
  mounted() {
    this.$refs.getEventsFormBlank.submit();
    this.$refs.getRequestsFormBlank.submit();
    this.$refs.getEventResponsesForm.submit();
    this.$refs.getProfileForm.submit();
  },
};
</script>
