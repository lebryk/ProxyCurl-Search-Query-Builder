"use client";

export let globalAudio: HTMLAudioElement | undefined = undefined;

export function resetGlobalAudio() {
  if (globalAudio) {
    globalAudio.pause();
    globalAudio.currentTime = 0;
  } else {
    globalAudio = new Audio();
  }
}

export async function speak(text: string) {
  resetGlobalAudio();
  if (!globalAudio) return;

  const encodedText = encodeURIComponent(text);
  const url = `/api/tts?text=${encodedText}`;
  globalAudio.src = url;
  
  try {
    await globalAudio.play();
    await new Promise<void>((resolve) => {
      if (!globalAudio) return;
      globalAudio.onended = function () {
        resolve();
      };
    });
    // Add a small delay after speech ends
    await new Promise((resolve) => setTimeout(resolve, 500));
  } catch (error) {
    console.error("Error playing audio:", error);
  }
}
