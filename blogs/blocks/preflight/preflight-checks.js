// eslint-disable-next-line import/prefer-default-export
export const checks = [];

checks.push({
  name: 'Has H1',
  category: 'SEO',
  exec: (doc) => {
    const res = {
      status: true,
      msg: '',
    };
    const h1s = doc.querySelectorAll('h1');
    if (h1s.length === 1) {
      res.status = true;
      res.msg = 'Only one H1 on the page.';
      return res;
    }

    res.status = false;

    if (h1s.length === 0) {
      res.msg = 'No H1 on the page.';
    }

    res.msg = 'More than one H1 on the page.';

    return res;
  },
});

checks.push({
  name: 'Page Title',
  category: 'SEO',
  exec: (doc) => {
    const res = {
      status: true,
      msg: 'Title size is good.',
    };
    const titleSize = doc.title.replace(/\s/g, '').length;
    if (titleSize < 15) {
      res.status = false;
      res.msg = 'Title size is too short (<15 characters).';
    }
    if (titleSize > 70) {
      res.status = false;
      res.msg = 'Title size is too long (>70 characters).';
    }

    return res;
  },
});

checks.push({
  name: 'Meta Description',
  category: 'SEO',
  exec: (doc) => {
    const res = {
      status: true,
      msg: 'Meta description size is good.',
    };
    const metaDesc = doc.querySelector('meta[name="description"]');
    if (!metaDesc) {
      res.status = false;
      res.msg = 'No meta description found.';
    } else {
      const descSize = metaDesc.content.replace(/\s/g, '').length;
      if (descSize < 50) {
        res.status = false;
        res.msg = 'Reason: Meta description too short.';
      } else if (descSize > 150) {
        res.status = false;
        res.msg = 'Reason: Meta description too long.';
      }
    }

    return res;
  },
});

checks.push({
  name: 'Canonical',
  category: 'SEO',
  exec: (doc) => {
    const res = {
      status: true,
      msg: 'Canonical reference is valid.',
    };
    const canon = doc.querySelector("link[rel='canonical']");
    const { href } = canon;
    try {
      fetch(href.replace('www.keysight.com', window.location.hostname), { method: 'HEAD' })
        .then((resp) => {
          if (!resp.ok) {
            res.status = false;
            res.msg = 'Error with canonical reference.';
          }
          if (resp.ok) {
            if (resp.status >= 300 && resp.status <= 308) {
              res.status = false;
              res.msg = 'Canonical reference redirects.';
            } else {
              res.status = true;
              res.msg = 'Canonical referenced is valid.';
            }
          }
        });
    } catch (e) {
      res.status = false;
      res.msg = 'Error with canonical reference.';
    }

    return res;
  },
});

checks.push({
  name: 'Body Size',
  category: 'SEO',
  exec: (doc) => {
    const res = {
      status: true,
      msg: 'Body size is good.',
    };
    const bodySize = doc.documentElement.innerText.replace(/\s/g, '').length;
    if (bodySize > 200) {
      res.status = true;
      res.msg = 'Body content has a good length.';
    } else {
      res.status = false;
      res.msg = 'Body does not have enough content.';
    }

    return res;
  },
});

checks.push({
  name: 'Links',
  category: 'SEO',
  exec: (doc) => {
    const res = {
      status: true,
      msg: 'Links are valid.',
    };
    const links = doc.querySelectorAll('body > main a[href]');

    let badLink = false;
    // eslint-disable-next-line no-restricted-syntax
    for (const link of links) {
      const { href } = link;
      try {
        fetch(href.replace('www.keysight.com', window.location.hostname), { method: 'HEAD' })
          // eslint-disable-next-line no-loop-func
          .then((resp) => {
            if (!resp.ok) {
              badLink = true;
            }
          })
          .catch((error) => {
            console.log('error is', error);
            res.status = false;
            res.msg = 'There are seriously broken links.';
            return res;
          });
      } catch (e) {
        badLink = true;
      }
    }

    if (badLink) {
      res.status = false;
      res.msg = 'There are one or more broken links.';
    } else {
      res.status = true;
      res.msg = 'Links are valid.';
    }

    return res;
  },
});

checks.push({
  name: 'Image Alt-Text',
  category: 'SEO',
  exec: (doc) => {
    const res = {
      status: true,
      msg: 'All Images have alt-text.',
    };
    let invalidAltTextCount = 0;
    // if img is a child of these blocks then ignore check
    const blocksToExclude = ['post-card'];
    const imgElements = doc.querySelectorAll('body > main img');
    for (let i = 0; i < imgElements.length; i += 1) {
      const altText = imgElements[i];
      if (!blocksToExclude.includes(altText.closest('div').className) && altText.alt === "") {
        invalidAltTextCount += 1;
      }
    }
    if (invalidAltTextCount > 0) {
      res.status = false;
      res.msg = `${invalidAltTextCount} image(s) have no alt-text.`;
    } else {
      res.status = true;
      res.msg = 'Image alt-text are valid.';
    }

    return res;
  },
});

checks.push({
  name: 'Hero Image',
  category: 'Blog Post',
  exec: (doc) => {
    const res = {
      status: true,
      msg: 'Blog post has hero image.',
    };

    const templateMetaTag = doc.querySelector('meta[name="template"]');
    if (templateMetaTag && templateMetaTag.content === 'post') {
      const heroImg = doc.querySelector('body > main .hero img');
      if (heroImg && heroImg.src !== '') {
        res.status = true;
        res.msg = 'Blog post has hero image.';
      } else {
        res.status = false;
        res.msg = 'Blog post has no hero image.';
      }
    } else {
      res.status = true;
      res.msg = 'Page is not a blog post.';
    }

    return res;
  },
});

checks.push({
  name: 'Publish date & Read time',
  category: 'Blog Post',
  exec: (doc) => {
    const res = {
      status: true,
      msg: 'Blog post has hero image.',
    };

    const templateMetaTag = doc.querySelector('meta[name="template"]');
    if (templateMetaTag && templateMetaTag.content === 'post') {
      const heroImg = doc.querySelector('body > main .hero img');
      if (heroImg && heroImg.src !== '') {
        res.status = true;
        res.msg = 'Blog post has hero image.';
      } else {
        res.status = false;
        res.msg = 'Blog post has no hero image.';
      }
    } else {
      res.status = true;
      res.msg = 'Page is not a blog post.';
    }

    return res;
  },
});
