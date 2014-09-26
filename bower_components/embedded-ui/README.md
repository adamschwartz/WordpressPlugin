# Embedded UI

This is the UI which is injected by the bundler into requests which come from cookie-identified users.  It includes the welcome screen, the placement code, and the little preview info box.

## Running locally

### The client-side code

- You must already [have go setup](https://github.com/EagerIO/GoBootstrap/blob/master/README.md)
- Pull down the [fast service](https://github.com/eagerio/fast)
- Run fast.  Use vee to forward the port and serve https for you.
- Add fast.eager.io to your /etc/hosts file, redirecting it to localhost

You are now serving requests locally.  To make your local fast server see your local changes to embedded-ui:

- Run `bower link` in embedded ui, and `bower link embedded-ui` in fast
- Fast only loads the file once, so you'll have to restart it when you make changes

### The iframes

Embedded UI also serves several iframed pages.  To develop them locally, redirect `embedded.eager.io` to localhost.  Have vee proxy urls which start with that host to a local static server serving this project.
