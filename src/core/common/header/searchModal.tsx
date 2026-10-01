import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { searchRecent, searchQuickLinks } from "../../data/json/headerData";

/**
 * Global search palette (`#muiSearchModal` in the template).
 * Rendered outside `.main-wrapper`, opened with Cmd/Ctrl+K or the header search box.
 */
const SearchModal = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    };
    const onOpenRequest = () => setOpen(true);

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mui-search-open", onOpenRequest);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mui-search-open", onOpenRequest);
    };
  }, []);

  useEffect(() => {
    if (open) {
      setQuery("");
      inputRef.current?.focus();
    }
  }, [open]);

  const needle = query.trim().toLowerCase();
  const recent = useMemo(
    () => searchRecent.filter((r) => r.label.toLowerCase().includes(needle)),
    [needle]
  );
  const quick = useMemo(
    () => searchQuickLinks.filter((q) => q.label.toLowerCase().includes(needle)),
    [needle]
  );
  const isEmpty = recent.length === 0 && quick.length === 0;

  if (!open) return null;

  return (
    <div
      className="mui-search-modal"
      id="muiSearchModal"
      role="dialog"
      aria-modal="true"
      aria-label="Search"
    >
      <div className="mui-search-backdrop" onClick={() => setOpen(false)} />
      <div className="mui-search-panel">
        <div className="mui-search-top">
          <i className="ti ti-search" />
          <input
            ref={inputRef}
            type="text"
            id="muiSearchInput"
            placeholder="Search students, staff, classes, invoices..."
            autoComplete="off"
            aria-label="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <span className="mui-search-esc" onClick={() => setOpen(false)}>
            ESC
          </span>
        </div>
        <div className="mui-search-body">
          {recent.length > 0 && (
            <div className="mui-search-sec" data-search-recent="">
              <div className="mui-search-sec-hdr">Recent</div>
              {recent.map((item) => (
                <Link
                  key={item.label}
                  to={item.link}
                  className="mui-search-row"
                  onClick={() => setOpen(false)}
                >
                  <span className="msr-ic">
                    <i className="ti ti-clock" />
                  </span>
                  <span className="msr-txt">{item.label}</span>
                  <i className="ti ti-corner-down-left msr-go" />
                </Link>
              ))}
            </div>
          )}
          {quick.length > 0 && (
            <div className="mui-search-sec">
              <div className="mui-search-sec-hdr">Quick links</div>
              {quick.map((item) => (
                <Link
                  key={item.label}
                  to={item.link}
                  className="mui-search-row"
                  onClick={() => setOpen(false)}
                >
                  <span className={`msr-ic ${item.tone}`}>
                    <i className={item.icon} />
                  </span>
                  <span className="msr-txt">{item.label}</span>
                  <span className="msr-tag">Page</span>
                </Link>
              ))}
            </div>
          )}
          {isEmpty && (
            <div className="mui-search-empty" data-search-empty="">
              <i className="ti ti-search-off" />
              No results found
            </div>
          )}
        </div>
        <div className="mui-search-foot">
          <span>
            <span className="mui-kbd">&#8593;</span>
            <span className="mui-kbd">&#8595;</span>navigate
          </span>
          <span>
            <span className="mui-kbd">&#8629;</span>open
          </span>
          <span>
            <span className="mui-kbd">esc</span>close
          </span>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
