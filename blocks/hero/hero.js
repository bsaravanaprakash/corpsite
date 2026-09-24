/**
 * Loads and decorates the hero.
 *
 * The default hero is a simple image + text block that is styled entirely
 * with CSS, so it needs no decoration here. The `video` variant turns the
 * authored link into a muted, autoplaying, looping background video, with the
 * authored image used as the poster/fallback and the remaining rich text
 * layered on top.
 * @param {Element} block The hero block element
 */
export default function decorate(block) {
  if (!block.classList.contains('video')) return;

  // The video source is authored as a link to a video asset (e.g. an MP4).
  const videoLink = block.querySelector('a[href]');
  if (!videoLink) return;

  const src = videoLink.getAttribute('href');
  // The authored image (if any) is reused as the poster/fallback.
  const picture = block.querySelector('picture');
  const img = picture?.querySelector('img');

  // The text layer is whichever cell holds the heading/copy (not the media).
  const textCell = [...block.querySelectorAll(':scope > div > div, :scope > div')]
    .find((cell) => cell.querySelector('h1, h2, h3, p:not(:has(a[href], img))')
      && !cell.contains(videoLink) && !cell.contains(picture));

  const video = document.createElement('video');
  video.className = 'hero-video-bg';
  video.setAttribute('autoplay', '');
  video.muted = true;
  video.setAttribute('muted', '');
  video.setAttribute('loop', '');
  video.setAttribute('playsinline', '');
  video.setAttribute('aria-hidden', 'true');
  video.setAttribute('tabindex', '-1');
  video.setAttribute('preload', 'metadata');
  if (img?.getAttribute('src')) video.setAttribute('poster', img.getAttribute('src'));

  const source = document.createElement('source');
  source.src = src;
  source.type = 'video/mp4';
  video.append(source);

  // Media layer: the video with the poster image behind it as a fallback.
  const media = document.createElement('div');
  media.className = 'hero-video-media';
  media.append(video);
  if (picture) media.append(picture);

  // Rebuild the block as a clean [media, text] structure so the CSS can
  // stack the two layers in a single grid cell.
  const children = [media];
  if (textCell) {
    const text = document.createElement('div');
    text.className = 'hero-video-content';
    text.append(...textCell.childNodes);
    children.push(text);
  }
  block.replaceChildren(...children);

  // Attempt to start playback (some browsers require an explicit call).
  if (video.play) video.play().catch(() => {});
}
