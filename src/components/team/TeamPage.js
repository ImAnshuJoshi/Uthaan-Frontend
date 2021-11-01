import React, { useEffect, useRef } from "react";

import "../../styles/team/team_page.css";

import TeamIndividualDataObj from "./team_timeline/helpers/team_individual_data_obj_constructor";
import TeamTimeline from "./team_timeline/TeamTimeline";
import { team } from "./../../services/team.service";
import { foundersData } from "../../utils/GeneralConstants";
// import { func } from "prop-types";

function TeamPage() {
  const [teamData, setTeamData] = React.useState({
    Foundes: null,
    Alumni: null,
    Executives: null,
  });

  useEffect(() => {
    fetchTeamData();
  }, []);

  const teamPagePrimaryWrapperRef = useRef(123);

  useEffect(() => {
    let childnodes = teamPagePrimaryWrapperRef.current.childNodes;
    for (let i = 0; i < childnodes?.length; i++) {
      childnodes[i].addEventListener("mousewheel", (e) => {
        if (i == 0 && window.innerWidth > 850) {
          return;
        }
        e.preventDefault();

        if (e.deltaY > 0) {
          if (e.deltaY - childnodes[i].getBoundingClientRect().top > 0) {
            if (
              childnodes[i].scrollLeft <=
              childnodes[i].scrollWidth - childnodes[i].clientWidth - 5
            ) {
              childnodes[i].scrollBy({
                top: 0,
                left: e.deltaY,
              });
            } else {
              window.scrollBy(0, e.deltaY);
            }
          } else {
            window.scrollBy(0, childnodes[i].getBoundingClientRect().top);
          }
        } else {
          if (childnodes[i].getBoundingClientRect().bottom + e.deltaY > 0) {
            if (childnodes[i].scrollLeft != 0) {
              childnodes[i].scrollBy({
                top: 0,
                left: e.deltaY,
              });
            } else {
              window.scrollBy(0, e.deltaY);
            }
          } else {
            window.scrollBy(0, -childnodes[i].getBoundingClientRect().bottom);
          }
        }

        // scrollContainer.scrollLeft += evt.deltaY;
      });
    }
  }, []);

  async function fetchTeamData() {
    try {
      const receivedImagesData = await team();

      let foundersTempData = foundersData;
      let alumniTempData = parseTeamData(receivedImagesData.data.alumni);
      let executivesTempData = parseTeamData(receivedImagesData.data.executive);

      setTeamData({
        Foundes: foundersTempData,
        Alumni: alumniTempData,
        Executives: executivesTempData,
      });
    } catch (error) {
      console.error(error);
    }
  }

  function parseTeamData(data) {
    if (!data || data?.length === 0 || data === null) {
      return [];
    }
    const withHttp = (url) => {
      if (!url) {
        return null;
      }
      return !/^https?:\/\//i.test(url) ? `http://${url}` : url;
    };

    let dataToReturn = [];
    for (let i = 0; i < data.length; i++) {
      let child = data[i];
      dataToReturn.push(
        new TeamIndividualDataObj(
          child.name,
          {
            facebookLink: withHttp(child.links.facebook),
            linkedinLink: withHttp(child.links.linkedin),
            mailID: child.links.email ? "mailto:" + child.links.email : null,
            githubLink: withHttp(child.links.github),
            instagramLink: withHttp(child.links.instagram),
          },
          child.image,
          child.statement
        )
      );
    }
    return dataToReturn;
  }

  return (
    <div className="team-page-primary-wrapper" ref={teamPagePrimaryWrapperRef}>
      <div
        className="team-page-founders-wrapper team-list-wrapper-for-horizontal-scroll"
      >
        <h3 className="team-page-heading founders-heading">Founder’s word</h3>
        <div className="team-page-founders-list-wrapper">
          <TeamTimeline timelineData={teamData.Foundes} lineColor="#F5F5F5" />
        </div>
      </div>
      <div className="team-page-alumni-wrapper team-list-wrapper-for-horizontal-scroll">
        <h3 className="team-page-heading">Alumni</h3>
        <div className="team-page-alumni-list-wrapper">
          <TeamTimeline timelineData={teamData.Alumni} lineColor="#FBC9FC" />
        </div>
      </div>
      <div className="team-page-executives-wrapper team-list-wrapper-for-horizontal-scroll">
        <h3 className="team-page-heading">Executives</h3>
        <div className="team-page-executives-list-wrapper">
          <TeamTimeline
            timelineData={teamData.Executives}
            lineColor="#FBC9FC"
          />
        </div>
      </div>
    </div>
  );
}

export default TeamPage;
