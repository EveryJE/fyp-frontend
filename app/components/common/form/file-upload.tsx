
const FileUpload = () => {
  // useEffect(() => {
  //   // Initialize Preline file upload
  //   if (window.HSFileUpload) {
  //     window.HSFileUpload.autoInit();
  //   }
  // }, []);

  return (
    <div
      data-hs-file-upload='{
        "url": "/upload",
        "extensions": {
          "default": {
                      "icon": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4\"/><path d=\"M14 2v4a2 2 0 0 0 2 2h4\"/><path d=\"m5 12-3 3 3 3\"/><path d=\"m9 18 3-3-3-3\"/></svg>",
            "class": "shrink-0 size-5"
          },
          "xls": {
            "icon": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4\"/><path d=\"M14 2v4a2 2 0 0 0 2 2h4\"/><path d=\"m5 12-3 3 3 3\"/><path d=\"m9 18 3-3-3-3\"/></svg>",
            "class": "shrink-0 size-5"
          },
          "zip": {
                      "icon": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4\"/><path d=\"M14 2v4a2 2 0 0 0 2 2h4\"/><path d=\"m5 12-3 3 3 3\"/><path d=\"m9 18 3-3-3-3\"/></svg>",
            "class": "shrink-0 size-5"
          },
          "csv": {
            "icon": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4\"/><path d=\"M14 2v4a2 2 0 0 0 2 2h4\"/><path d=\"m5 12-3 3 3 3\"/><path d=\"m9 18 3-3-3-3\"/></svg>",
            "class": "shrink-0 size-5"
          }
        }
      }'
      className="w-full"
    >
      <template data-hs-file-upload-preview="">
        <div className="p-3 bg-white border border-gray-300 rounded-xl dark:bg-slate-800 dark:border-slate-600">
          <div className="mb-2 flex justify-between items-center">
            <div className="flex items-center gap-x-3">
              <span
                className="size-8 flex justify-center items-center border border-gray-200 text-gray-500 rounded-lg dark:border-slate-700 dark:text-slate-500"
                data-hs-file-upload-file-icon=""
              >
                <img className="rounded-lg hidden" data-dz-thumbnail="" alt="File preview" />
              </span>
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-white">
                  <span className="truncate inline-block max-w-75 align-bottom" data-hs-file-upload-file-name=""></span>
                  .<span data-hs-file-upload-file-ext=""></span>
                </p>
                <p className="text-xs text-gray-500 dark:text-slate-500" data-hs-file-upload-file-size=""></p>
              </div>
            </div>
            <div className="inline-flex items-center gap-x-2">
              <button
                type="button"
                className="text-gray-500 hover:text-gray-800 focus:outline-none focus:text-gray-800 dark:text-slate-500 dark:hover:text-slate-200 dark:focus:text-slate-200"
                data-hs-file-upload-remove=""
              >
                <svg
                  className="shrink-0 size-4"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 6h18"></path>
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                  <line x1="10" x2="10" y1="11" y2="17"></line>
                  <line x1="14" x2="14" y1="11" y2="17"></line>
                </svg>
              </button>
            </div>
          </div>
          <div className="flex items-center gap-x-3 whitespace-nowrap">
            <div
              className="flex w-full h-2 bg-gray-200 rounded-full overflow-hidden dark:bg-slate-700"
              role="progressbar"
              aria-valuenow={0}
              aria-valuemin={0}
              aria-valuemax={100}
              data-hs-file-upload-progress-bar=""
            >
              <div
                className="flex flex-col justify-center rounded-full overflow-hidden bg-blue-600 text-xs text-white text-center whitespace-nowrap transition-all duration-500 hs-file-upload-complete:bg-green-600 dark:bg-blue-500"
                style={{ width: '0%' }}
                data-hs-file-upload-progress-bar-pane=""
              ></div>
            </div>
            <div className="w-10 text-end">
              <span className="text-sm text-gray-800 dark:text-white">
                <span data-hs-file-upload-progress-bar-value="">0</span>%
              </span>
            </div>
          </div>
        </div>
      </template>

      <div
        className="cursor-pointer p-12 flex justify-center bg-white border border-dashed border-gray-300 rounded-xl dark:bg-slate-800 dark:border-slate-600"
        data-hs-file-upload-trigger=""
      >
        <div className="text-center">
          <svg
            className="w-16 text-gray-400 mx-auto dark:text-slate-400"
            width="70"
            height="46"
            viewBox="0 0 70 46"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6.05172 9.36853L17.2131 7.5083V41.3608L12.3018 42.3947C9.01306 43.0871 5.79705 40.9434 5.17081 37.6414L1.14319 16.4049C0.515988 13.0978 2.73148 9.92191 6.05172 9.36853Z"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="2"
              className="fill-white stroke-gray-400 dark:fill-slate-800 dark:stroke-slate-500"
            ></path>
            <path
              d="M63.9483 9.36853L52.7869 7.5083V41.3608L57.6982 42.3947C60.9869 43.0871 64.203 40.9434 64.8292 37.6414L68.8568 16.4049C69.484 13.0978 67.2685 9.92191 63.9483 9.36853Z"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="2"
              className="fill-white stroke-gray-400 dark:fill-slate-800 dark:stroke-slate-500"
            ></path>
            <rect
              x="17.0656"
              y="1.62305"
              width="35.8689"
              height="42.7541"
              rx="5"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="2"
              className="fill-white stroke-gray-400 dark:fill-slate-800 dark:stroke-slate-500"
            ></rect>
            <path
              d="M47.9344 44.3772H22.0655C19.3041 44.3772 17.0656 42.1386 17.0656 39.3772L17.0656 35.9161L29.4724 22.7682L38.9825 33.7121C39.7832 34.6335 41.2154 34.629 42.0102 33.7025L47.2456 27.5996L52.9344 33.7209V39.3772C52.9344 42.1386 50.6958 44.3772 47.9344 44.3772Z"
              stroke="currentColor"
              strokeWidth="2"
              className="stroke-gray-400 dark:stroke-slate-500"
            ></path>
            <circle
              cx="39.5902"
              cy="14.9672"
              r="4.16393"
              stroke="currentColor"
              strokeWidth="2"
              className="stroke-gray-400 dark:stroke-slate-500"
            ></circle>
          </svg>

          <div className="mt-4 flex flex-wrap justify-center text-sm/6 text-gray-600">
            <span className="pe-1 font-medium text-gray-800 dark:text-slate-200">
              Drop your file here or
            </span>
            <span className="bg-white font-semibold text-blue-600 hover:text-blue-700 rounded-lg decoration-2 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 dark:bg-slate-800 dark:text-blue-500 dark:hover:text-blue-600">
              browse
            </span>
          </div>

          <p className="mt-1 text-xs text-gray-400 dark:text-slate-400">
            Pick a photo up to 2MB.
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-3 empty:mt-0" data-hs-file-upload-previews=""></div>
    </div>
  );
};

export default FileUpload;