// Sound effects for typing practice
export class SoundManager {
  private audioContext: AudioContext | null = null;
  private enabled = false;

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        this.enabled = true;
      } catch {
        console.log('Audio not supported');
      }
    }
  }

  private createBeep(frequency: number, duration: number, volume: number = 0.1) {
    if (!this.audioContext || !this.enabled) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + 0.01);
    gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + duration);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  keyPress() {
    this.createBeep(800, 0.05, 0.05);
  }

  keyError() {
    this.createBeep(300, 0.1, 0.08);
  }

  wordComplete() {
    this.createBeep(1000, 0.08, 0.06);
  }

  testComplete() {
    // Play a pleasant chord
    setTimeout(() => this.createBeep(523, 0.3, 0.1), 0);   // C
    setTimeout(() => this.createBeep(659, 0.3, 0.1), 50);  // E
    setTimeout(() => this.createBeep(784, 0.3, 0.1), 100); // G
  }

  enable() {
    this.enabled = true;
  }

  disable() {
    this.enabled = false;
  }

  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }
}

export const soundManager = new SoundManager();
