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

async function validateLink(href, checkRedirect, message) {
  const result = {
    valid: true,
    msg: '',
  };
  try {
    fetch(href.replace('www.keysight.com', window.location.hostname), { method: 'HEAD' })
      .then((resp) => {
        if (!resp.ok) {
          result.valid = false;
          result.msg = `Error with ${message}.`;
        }
        if (resp.ok) {
          result.status = true;
          result.msg = `${message} is valid.`;
          if (checkRedirect) {
            if (resp.status >= 300 && resp.status <= 308) {
              result.status = false;
              result.msg = `${message} redirects.`;
            }
          }
        }
      });
  } catch (e) {
    result.status = false;
    result.msg = `'Error with ${message}.`;
  }
  return result;
}

checks.push({
  name: 'Canonical',
  category: 'SEO',
  exec: (doc) => {
    const canon = doc.querySelector("link[rel='canonical']");
    const { href } = canon;
    const res = validateLink(href, true, 'Canonical reference');

    // try {
    //   fetch(href.replace('www.keysight.com', window.location.hostname), { method: 'HEAD' })
    //     .then((resp) => {
    //       if (!resp.ok) {
    //         res.status = false;
    //         res.msg = 'Error with canonical reference.';
    //       }
    //       if (resp.ok) {
    //         if (resp.status >= 300 && resp.status <= 308) {
    //           res.status = false;
    //           res.msg = 'Canonical reference redirects.';
    //         } else {
    //           res.status = true;
    //           res.msg = 'Canonical referenced is valid.';
    //         }
    //       }
    //     });
    // } catch (e) {
    //   res.status = false;
    //   res.msg = 'Error with canonical reference.';
    // }

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

    let badLink;
    // eslint-disable-next-line no-restricted-syntax
    for (const link of links) {
      try {
        // badLink = fetch(link.href.replace('www.keysight.com', window.location.hostname)
        // , { method: 'HEAD' })
        badLink = fetch('https://preflight--keypreflight--gandal-adobe.hlx.page/blogs/tech/nwvs/2023/04/06/copy-of-have-you-put-in-your-10000-hours-of-cyber-security-training', { method: 'HEAD' })
          .then((resp) => {
            console.log(link);
            if (!resp.ok) {
              return true;
            }
            return false;
          });
        if (badLink) {
          break;
        }
      } catch (e) {
        badLink = true;
        break;
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
