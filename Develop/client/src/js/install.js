const butInstall = document.getElementById('buttonInstall');

// Logic for handling the beforeinstallprompt event
window.addEventListener('beforeinstallprompt', (event) => {
  // Prevent the mini-infobar from appearing on mobile
  event.preventDefault();
  // Stash the event so it can be triggered later.
  window.deferredPrompt = event;
  // Update UI notify the user they can install the PWA
  butInstall.style.display = 'block';
});

// Implement the click event handler on the `butInstall` button
butInstall.addEventListener('click', async () => {
  const promptEvent = window.deferredPrompt;
  if (!promptEvent) {
    return;
  }
  // Show the install prompt
  promptEvent.prompt();
  // Wait for the user to respond to the prompt
  const result = await promptEvent.userChoice;
  console.log(`User response to the install prompt: ${result.outcome}`);
  // We no longer need the prompt
  window.deferredPrompt = null;
  butInstall.style.display = 'none';
});

// Handler for the `appinstalled` event
window.addEventListener('appinstalled', (event) => {
  console.log('PWA was installed');
});
