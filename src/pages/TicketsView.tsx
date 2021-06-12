import React, {Component} from "react";
import ReactDOM from "react-dom";

import {
    IonContent,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonListHeader,
    IonMenu,
    IonMenuToggle,
    IonNote,
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonCard,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonCardContent,
    IonButton,
    IonButtons, IonMenuButton
} from '@ionic/react';

import api from "../api";

interface MenuState {
    data: any;
    date: Date;
}
interface Props {
    id: number
}

export default class Menu extends Component<Props, MenuState> {

    constructor(props : any) {
        super(props)
        this.state = {
            date: new Date(),
            data: null
        }
    }

    async reloadList() {

        let data = (await api.getTicket(this.props.id)).data
        console.log(data);
        this.setState({data});
    }

    async componentDidMount() {
        await this.reloadList();

    }

    componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<MenuState>, snapshot?: any) {
        if(prevProps.id !== this.props.id){
            this.setState({data:null});
            this.reloadList();
        }
    }

    componentWillUnmount() {

    }

    render() {

        // eslint-disable-next-line react-hooks/rules-of-hooks


        let data = this.state.data;
        if(!data || !data.assets.Ticket[this.props.id]) return (<div>Loading</div>);


        let ticket = data.assets.Ticket[this.props.id];
        // @ts-ignore
        return (

            <IonPage>
                <IonHeader>
                    <IonToolbar>

                        <IonButtons slot="start">
                            <IonMenuButton />
                        </IonButtons>
                        <IonTitle>{ticket.title}</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent>

                    {data.ticket_article_ids.map((ticketRef : any)=>{

                        let article = data.assets.TicketArticle[ticketRef]
                        article.created_by = article.created_by_id ? data.assets.User[article.created_by_id] : {}
                        article.organization = article.created_by.organization_id ? data.assets.Organization[article.created_by.organization_id] : {}

                        return (

                        <IonCard key={article.id}>
                            <IonCardHeader>
                                <IonCardSubtitle>{article.created_by.firstname.length>1?(<span>{article.created_by.firstname} {article.created_by.lastname} @ {article.organization.name}</span>):article.from}</IonCardSubtitle>
                                <IonCardTitle>{ticket.subject}</IonCardTitle>
                            </IonCardHeader>

                            <IonCardContent >
                                <div dangerouslySetInnerHTML={{__html:article.body}} />
                            </IonCardContent>
                        </IonCard>
                    )
                    })}

                </IonContent>
            </IonPage>

        );
    }
}


