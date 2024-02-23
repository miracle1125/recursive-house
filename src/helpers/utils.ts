import { SlaSettings, SlaType, Team } from '@/apis/models/teams';
import { getCookie } from 'cookies-next';
import JSZip from 'jszip';
import { startCase, upperFirst, values } from 'lodash';
import { Cycle } from '../apis/models/cycles';
import { domToPng } from 'modern-screenshot';
import { POPULAR_DOMAINS } from '../json/domains';

export const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const getValueFromPath = (obj: any, path: string) => {
  const pathParts = path.split('.');
  let value = obj;
  for (const pathPart of pathParts) {
    value = value?.[pathPart];
  }
  return value;
};

export const urlToPageName = (url: string) => {
  return url
    .split('/')
    .map((word) => word.split('-'))
    .flat()
    .map(upperFirst)
    .join(' ');
};

export const getPageName = (path: string) => {
  // We follow a strict pattern for our pathnames.
  // Either single word lower case "page"
  // or multiple word separated with a dash "my-page".
  // If the page has children like "my/new-page/3"
  // we convert it to "My New Page"

  let pageName = path.replace('/hub/', '');
  pageName = urlToPageName(pageName);
  pageName = pageName.replace(/[0-9]/g, '');
  pageName = pageName.replace(/\s\s+/g, ' ');

  return pageName;
};

export const getFirstSubscribedTeamRoute = (
  subscribedTeams: Team[],
  isTeamOverviewEnabled?: boolean,
) => {
  return (
    subscribedTeams?.[0] &&
    `/team/${subscribedTeams[0].id}/${
      isTeamOverviewEnabled ? 'overview' : 'standup'
    }`
  );
};

export const parseStringToJson = (objAsString: string) => {
  try {
    const obj = JSON.parse(objAsString);

    // Handle non-exception-throwing cases:
    // Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
    // but... JSON.parse(null) returns null, and typeof null === "object",
    // so we must check for that, too. Thankfully, null is falsy, so this suffices:
    if (obj && typeof obj === 'object') {
      return obj;
    }
  } catch {} // eslint-disable-line no-empty

  return undefined;
};

export const openInNewTab = (url: string) => {
  const win = window.open(url, '_blank');
  win?.focus();
};

/**
 * This function round number to the nearest 2nd factor if necessary
 * Example:
 *  - 1.123 -> 1.12
 *  - 1.1   -> 1.1
 * @param num number
 */
export default function roundNumber(num: number): number {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}

export const isAdmin = () => {
  return !!getCookie('admin');
};

export const exportElementToPng = async (
  domElement: HTMLElement,
  filename: string,
) => {
  if (domElement) {
    try {
      const url = await domToPng(domElement, {
        features: {
          // Fix emojis bug in Safari (https://github.com/qq15725/modern-screenshot/issues/35)
          removeControlCharacter: false,
        },
      });

      const link = document.createElement('a');

      if (typeof link.download === 'string') {
        link.href = url;
        link.download = filename;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }
};

export const objectsToCsv = function (data: Record<string, any>[]) {
  const csvRows = [];

  /* Get headers as every csv data format
        has header (head means column name)
        so objects key is nothing but column name
        for csv data using Object.key() function.
        We fetch key of object as column name for
        csv */
  const headers = Object.keys(data[0]);

  /* Using push() method we push fetched
           data into csvRows[] array */
  csvRows.push(headers.map((h) => startCase(h)).join(','));

  // Loop to get value of each objects key
  for (const row of data) {
    const values = headers.map((header) => {
      const val = row[header];
      if (val === '') {
        return;
      }
      return Number.isNaN(+val) ? `"${val}"` : +val;
    });

    const rowData = values.join(',');

    if (rowData !== ',') {
      csvRows.push(values.join(','));
    }
  }

  /* To add new line for each objects values
           and this return statement array csvRows
           to this function.*/
  return csvRows.join('\n');
};

export const exportDataToCSV = (data: string, filename: string) => {
  // Creating a Blob for having a csv file format
  // and passing the data with type
  const blob = new Blob([data], { type: 'text/csv' });

  // Creating an object for downloading url
  const dataUrl = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  link.click();
};

export const exportCSVZip = (
  files: { content: string; name: string }[],
  zipName: string,
) => {
  const zip = new JSZip();
  for (const file of files) {
    zip.file(file.name, file.content);
  }

  return zip.generateAsync({ type: 'base64' }).then(function (base64: string) {
    const dataUrl = 'data:application/zip;base64,' + base64;
    const link = document.createElement('a');
    link.download = zipName;
    link.href = dataUrl;
    link.click();
  });
};

export const copyToClipboard = (text: string) => {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text);
  } else {
    try {
      const tempInput = document.createElement('input');
      tempInput.value = text;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand('copy');
      document.body.removeChild(tempInput);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  }
};

export const getNameInitials = (name: string) => {
  const words = name.split(' ');
  let initials = '';
  for (let i = 0; i < words.length; i++) {
    const initial = words[i].charAt(0).toUpperCase();
    initials += initial;
  }
  return initials;
};

export const copyCurrentUrl = () => {
  const url = window.location.href;

  copyToClipboard(url);
};

export const moveArrayElement = (
  array: any[],
  fromIndex: number,
  toIndex: number,
) => {
  if (toIndex === fromIndex) {
    return array;
  }
  if (toIndex < 0) {
    toIndex = 0;
  }
  if (toIndex > array.length - 1) {
    toIndex = array.length - 1;
  }
  const movingElement = array[fromIndex];
  let updatedArray = [...array];
  updatedArray.splice(fromIndex, 1);

  if (toIndex > fromIndex) {
    updatedArray = [
      ...updatedArray.slice(0, toIndex),
      movingElement,
      ...updatedArray.slice(toIndex),
    ];
  } else {
    updatedArray = [
      ...updatedArray.slice(0, toIndex),
      movingElement,
      ...updatedArray.slice(toIndex),
    ];
  }
  return updatedArray;
};

export const teamIdExtractor = (path: string) => {
  const teamId = path.match(/\/team\/(\d+)/)?.[1];
  return teamId;
};

export const EMAIL_REGEX = /^[^\s@]+@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;

export const DOMAIN_REGEX =
  /^(http:\/\/|https:\/\/)?[a-zA-Z\d-]+\.[a-zA-Z\d-]+\.?[a-z]*$/i;

export const fixNumberIfDecimal = (num: number, decimalPlaces: number) => {
  return Number(Number(num).toFixed(decimalPlaces));
};

export const toSentenceCase = (string: string) =>
  string[0].toUpperCase() + string.slice(1).toLowerCase();

export const isAppleDevice = () => {
  const { userAgent } = navigator;
  return /(Mac|iPhone|iPod|iPad)/i.test(userAgent);
};

export const isSomeSlaSettingTruthy = (slaSettings?: SlaSettings | null) => {
  if (slaSettings?.[SlaType.BUG]) {
    const bugSlaSettings = slaSettings[SlaType.BUG];
    return values(bugSlaSettings).some((setting) =>
      values(setting).some((value) => !!value),
    );
  }
  return false;
};

export const scrapePageMetadata = (
  href?: string,
): Promise<Partial<{ title: string; icon: string }>> =>
  href
    ? fetch(href!)
        .then((res) => res.text())
        .then((pageData: string) => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(pageData, 'text/html');
          const title = doc.querySelector('title')?.textContent || '';

          const icon =
            doc.querySelector('link[rel="icon"]')?.getAttribute('href') || '';
          return { title, icon };
        })
        .catch(() => {
          return {};
        })
    : Promise.resolve({});

const JIRA_CHIP_SEARCH_REGEXES = [
  /^.*?atlassian\.net\/browse\/(.+?)(?:\?.*)?(?:#.*)?$/g,
  /^.*?atlassian\.net\/.*?[&?]selectedIssue=(.+?)(?:&.*)?(?:#.*)?$/g,
];

export const extractLinkNameFromUrl = (url: string) => {
  for (const regex of JIRA_CHIP_SEARCH_REGEXES) {
    const matches = url.matchAll(regex);

    for (const match of matches) {
      const text = match[1];
      if (text) {
        return text;
      }
    }
  }
  return null;
};

export const sortAndClearKanbanCycles = (cycles: Cycle[]) => {
  if (!cycles) {
    return [];
  }
  const sortedRetroData = [...cycles].sort((a: Cycle, b: Cycle) => {
    return new Date(b.date!).getTime() - new Date(a.date!).getTime();
  }) as Cycle[];

  // remove cycles from end of the list if they have no completed issues
  while (
    sortedRetroData.length > 1 &&
    sortedRetroData[sortedRetroData.length - 1] &&
    Number(
      sortedRetroData[sortedRetroData.length - 1]!.completedJiraIssue?.count ||
        0,
    ) === 0
  ) {
    sortedRetroData.pop();
  }

  return sortedRetroData;
};

export const copyContentToClipboard = (element: HTMLElement) => {
  const range = document.createRange();
  range.selectNode(element);
  window.getSelection()?.removeAllRanges();
  window.getSelection()?.addRange(range);
  document.execCommand('copy');
  window.getSelection()?.removeAllRanges();
};

export const returnFirstValueIfArray = (value?: any) => {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
};

//ref: https://webocreation.com/javascript-custom-email-validation-for-company-email-only-unbounce-page/
export const isBusinessEmail = (email: string) => {
  const domain = email.trim().split('@').pop();
  return !POPULAR_DOMAINS.includes(domain!);
};

export const getRandomColor = () => {
  const red = Math.floor(Math.random() * 256);
  const green = Math.floor(Math.random() * 256);
  const blue = Math.floor(Math.random() * 256);

  const rgbColor = `rgb(${red},${green},${blue})`;

  return rgbColor;
};
