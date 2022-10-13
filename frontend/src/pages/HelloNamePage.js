import axios from "axios";
import {HELLO_NAME_URL} from "../Endpoints";
import {ErrorMessage, Field, Form, Formik} from "formik";
import {useState} from "react";
import {Label} from "reactstrap";

export function HelloNamePage() {
    const [message, setMessage] = useState('');

    const submitForm = (values, actions) => {
        console.log(values);
        axios
            .post(HELLO_NAME_URL, values)
            .then((res) => {
                const {greeting} = res.data;
                setMessage(greeting);
            })
            .catch((errors) => {
                actions.setErrors(errors.response.data);
            });
    }

    return (
        <>
            <div className={'mb-4'}>
                {
                    message
                        ? <span className={'mb-4'}><b>Response: </b><span>{message}</span></span>
                        : null
                }
            </div>
            <Formik initialValues={{name: ''}} onSubmit={submitForm}>
                <Form>
                    <div className={'mb-2'}>
                        <Label className="form-label">Name</Label>
                        <Field id="name" name={"name"} type="text" className="form-control"
                               placeholder={'Input your name.'}/>
                        <ErrorMessage name={'name'} component="div" className={'text-danger form-text'}/>
                    </div>
                    <button type={'submit'} className={'btn btn-primary float-end'}>Submit</button>
                </Form>
            </Formik>
        </>
    );
}