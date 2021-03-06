import React from "react";
import PropTypes from "prop-types";
import Helmet from "react-helmet";
import { Link } from "react-router-dom";
import { Card, Typography, Icon, Collapse, Skeleton, Divider } from "antd";
import { translate } from "@gqlapp/i18n-client-react";
import { PageLayout, Button, MetaTags } from "@gqlapp/look-client-react";
import Loader from "@gqlapp/look-client-react/ui-antd/components/Loader";
import CatalogueWithInfiniteScroll from "@gqlapp/look-client-react/ui-antd/components/CatalogueWithInfiniteScroll";

import settings from "../../../../settings";
import FaqPublicFilterComponent from "./FaqPublicFilterComponent";

const { Text } = Typography;
const { Panel } = Collapse;

const AnimatedUnderLine = ({ width, alignment }) => {
  return (
    <div align={alignment}>
      <div
        key="line"
        className="title-line-wrapper"
        style={{ maxWidth: width }}
        align="left"
      >
        <div
          className="title-line"
          // style={{ transform: "translateX(-64px)" }}
        />
      </div>
    </div>
  );
};

const NoFaqsMessage = ({ t }) => <div className="text-center">No Faqs</div>;

const FaqView = (props) => {
  const { t, loading, faqs, stateLoading } = props;

  const fetchMoreData = async (e) => {
    const hasMore = props.faqs.pageInfo.hasNextPage;
    const endCursor = props.faqs.pageInfo.endCursor;
    const totalCount = props.faqs.totalCount;
    if (!hasMore) {
      return;
    } else {
      await props.loadDataFaqs(endCursor + 1, "add");
    }
  };
  return (
    <PageLayout>
      {/* Render metadata */}
      <MetaTags title="FAQs" description="FAQs" />
      <h1 style={{ fontSize: "32px" }}>
        <Icon type="customer-service" />
        {" FAQ's"}
      </h1>
      <AnimatedUnderLine width={"200px"} alignment="left" />
      <br />
      {!stateLoading && <FaqPublicFilterComponent {...props} />}
      <Divider />
      <br />
      <div>
        {loading && !faqs && (
          <div style={{ marginTop: "20px" }}>
            {[...Array(3).keys()].map(() => (
              <Skeleton
                style={{ marginBottom: "34px" }}
                active
                paragraph={{ rows: 1, width: "100%" }}
              ></Skeleton>
            ))}
          </div>
        )}

        {!loading && faqs && (
          <>
            {faqs.edges && faqs.edges.length !== 0 ? (
              <>
                <Collapse
                  className="faq-view-collapse"
                  style={{ background: "transparent" }}
                  bordered={false}
                  defaultActiveKey={["0"]}
                  expandIcon={({ isActive }) => (
                    <Icon type="caret-right" rotate={isActive ? 90 : 0} />
                  )}
                  expandIconPosition="right"
                >
                  {faqs.edges.map((item, key) => (
                    <Panel header={<h2>{item.node.question}</h2>} key={key}>
                      <p>{item.node.answer}</p>
                    </Panel>
                  ))}
                </Collapse>
                <br />
                {props.faqs.pageInfo.hasNextPage && (
                  <div align="center">
                    <Button onClick={fetchMoreData}>
                      <Icon type="down" />
                      {" Load More"}
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <NoFaqsMessage t={t} />
            )}
          </>
        )}
      </div>
    </PageLayout>
  );
};

FaqView.propTypes = {
  t: PropTypes.func,
};

export default translate("faqs")(FaqView);
