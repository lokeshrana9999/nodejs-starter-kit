// eslint-disable-next-line import/prefer-default-export
export { default as PageLayout } from "./PageLayout";
export { default as GroupLayout } from "./GroupLayout";
export { default as AccountLayout } from "./AccountLayout";

export { default as Button } from "./Button";
export { default as MenuItem } from "./MenuItem";
export { default as Form } from "./Form";
export { default as FormItem } from "./FormItem";
export { default as Input } from "./Input";
export { default as Select } from "./Select";
export { default as Option } from "./Option";
export { default as RenderField } from "./RenderField";
export { default as RenderSelect } from "./RenderSelect";
export { default as RenderAddress } from "./RenderAddress";
export { default as RenderCheckBox } from "./RenderCheckBox";
export { default as RenderUpload } from "./RenderUpload";
export { default as RenderUploadMultiple } from "./RenderUploadMultiple";
export { default as RenderDynamicField } from "./RenderDynamicField";
export { default as Alert } from "./Alert";
export { default as NavBar } from "./NavBar";
export { default as Carousel } from "./Carousel";
export { default as RenderRadioGroup } from "./RenderRadioGroup";

export { default as Container } from "./Container";
export { default as Row } from "./Row";
export { default as Col } from "./Col";
export { default as Label } from "./Label";
export { default as Card } from "./Card";
export { default as CardGroup } from "./CardGroup";
export { default as CardTitle } from "./CardTitle";
export { default as CardText } from "./CardText";
export { default as Table } from "./Table";
export { default as ListGroup } from "./ListGroup";
export { default as ListItem } from "./ListItem";
export { default as LanguagePicker } from "./LanguagePicker";
export { default as Pagination } from "./Pagination";
export { default as Avatar } from "./Avatar";
export { default as Icon } from "./Icon";
export { default as RenderContentField } from "./RenderContentField";
export { default as CatalogueWithInfiniteScroll } from "./CatalogueWithInfiniteScroll";
export { default as Loader } from "./Loader";
export { default as PageLoading } from "./PageLoading";
export { default as RenderTableLoading } from "./RenderTableLoading";

import { onAppCreate } from "./NavBar";
import { onAppCreateGroupLayout } from "./GroupLayout";
import { onAppCreateAccountLayout } from "./AccountLayout";

export const onAppCreateArr = [
  onAppCreate,
  onAppCreateGroupLayout,
  onAppCreateAccountLayout,
];

