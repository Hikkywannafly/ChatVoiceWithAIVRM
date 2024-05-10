import { buildUrl } from "@/utils/buildUrl";

export const GitHubLink = () => {
  return (
    <div className="absolute right-0 z-10 m-24">
      <a
        draggable={false}
        href=""
        rel="noopener noreferrer"
        target="_blank"
      >
        <div className="p-8 rounded-16 bg-[#1F2328] hover:bg-[#33383E] active:bg-[565A60] flex">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt=""
            height={24}
            width={24}
            src={buildUrl("/github-mark-white.svg")}
          ></img>
          <div className="mx-4 text-white font-M_PLUS_2 font-bold">Fork me</div>
        </div>
      </a>
    </div>
  );
};
