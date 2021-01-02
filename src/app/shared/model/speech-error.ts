export enum SpeechError {
  NoSpeech = 'no-speech',
  AudioCapture = 'audio-capture',
  NotAllowed = 'not-allowed',
  Unknown = 'unknown'
};

export enum SpeechErrorMessage {
  'no-speech' = `Cannot run the demo. Your browser is not authorized to access your microphone. Verify that your browser has access to your microphone and try again.`,
  'audio-capture' = 'No speech has been detected. Please try again.',
  'not-allowed' = 'Microphone is not available. Plese verify the connection of your microphone and try again.',
  'unknown' = ''
}