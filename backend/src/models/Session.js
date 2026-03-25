import { updateDoc, addDoc, getDoc } from "../firebase/utils.js";
import { states } from "../hard-code/states.js";
import { generateCode } from "../utils/code.js";

export class Session {
  sessionName = "";
  groupChatId = "";
  id = "";
  members = [];
  timeFrame = 0;
  createdAt = "";
  amountPerPerson = "";
  previouslyCollected = [];
  payment = [];
  status = false;
  groupCount = 0;
  removedMembers = [];
  state = null;
  registerLinkId = null;
  round = 0;

  // constructor(groupChatId, sessionName, timeFrame, amountPerPerson) {
  constructor(...args) {
    if (args.length === 1) {
      this.id = args[0];
      console.log(args);
    } else {
      this.groupChatId = args[0];
      this.sessionName = args[1];
      this.timeFrame = args[2];
      this.amountPerPerson = args[3];
      this.status = true;
      this.state = states[0];

      this.sendRegistration();
    }
  }

  async payoutForRound(sessionBuf) {
    try {
      const payeeIndex = this.members.findIndex(
        (data) => !data.payed && (data.active || data.active === undefined),
      );

      console.log(payeeIndex);
      console.log(this.members);

      // return;

      if (payeeIndex === -1) {
        return;
      }

      this.members[payeeIndex].payed = true;
      this.members = this.members.map((data) => ({ ...data, payment: 0 }));

      this.round++;
      const legibleMembers = this.members.filter((data) => data.active);

      const payedMembers = legibleMembers.filter((data) => data.payed);

      const hasFinishedPayout = legibleMembers.length === payedMembers.length;
      if (hasFinishedPayout) {
        this.state = states[2];
        this.status = false;
      }

      await this.updateDatabase();

      return {
        payee: this.members[payeeIndex],
        hasFinishedSession: hasFinishedPayout,
        nextPayee: this.members[payeeIndex + 1],
        session: sessionBuf,
      };
    } catch (error) {
      console.error(error);
      throw new Error("Error paying out");
    }
  }

  validateMember(memberId, tId) {
    try {
      const memberIdMap = this.members.map((data) => data.memberId);
      const result = memberIdMap.findIndex((data) => data === memberId);
      if (result === -1) return null;
      this.members[result].tId = tId;
      const namesOfRegistered = this.members
        .filter((data) => data.tId)
        .map((data, i) => `✅${i + 1}. ${data.lastname} ${data.firstname}`)
        .join("\n");
      return {
        message: `${this.members[result].firstname}`,
        registeredMessage: `<b>List of Registered members</b>\n\n${namesOfRegistered}`,
      };
    } catch (error) {
      console.error(error);
      throw new Error("Error validating members");
    }
  }

  addNewMember(lastname, firstname, nin, accountNumber, bankCode, bankName) {
    const memberInfo = {
      lastname,
      firstname,
      nin,
      accountNumber,
      bankCode,
      bankName,
      tId: null,
      memberId: generateCode(),
      payed: false,
      active: true,
    };

    this.members.push(memberInfo);
    return `${memberInfo.memberId}:${this.id}`;
  }

  async loadFromDatabase() {
    const data = await getDoc("Session", this.id);
    if (data) {
      this.sessionName = data.sessionName;
      this.groupChatId = data.groupChatId;
      this.members = data.members ?? [];
      this.timeFrame = data.timeFrame;
      this.createdAt = data.createdAt;
      this.amountPerPerson = data.amountPerPerson;
      this.previouslyCollected = data.previouslyCollected ?? [];
      this.payment = data.payment;
      this.status = data.status;
      this.groupCount = data.groupCount;
      this.removedMembers = data.removedMembers ?? [];
      this.state = data.state;
      this.registerLinkId = data.registerLinkId;
    }
    return;
  }

  async createDatabase() {
    try {
      const { id } = await addDoc("Session", {
        sessionName: this.sessionName,
        groupChatId: this.groupChatId,
        members: this.members,
        timeFrame: this.timeFrame,
        createdAt: new Date().toISOString(),
        amountPerPerson: this.amountPerPerson,
        previouslyCollected: this.previouslyCollected,
        payment: this.payment,
        status: this.status,
        groupCount: this.groupCount,
        removedMembers: this.removedMembers,
        state: this.state,
        registerLinkId: this.registerLinkId,
      });
      this.id = id; // store the generated Firestore ID back on the instance
      this.updateDatabase();
      return;
    } catch (error) {
      console.error(error);
      throw new Error("Error with the database");
    }
  }

  async updateDatabase() {
    try {
      await updateDoc("Session", this.id, {
        sessionName: this.sessionName,
        groupChatId: this.groupChatId,
        members: this.members,
        timeFrame: this.timeFrame,
        amountPerPerson: this.amountPerPerson,
        previouslyCollected: this.previouslyCollected,
        payment: this.payment,
        status: this.status,
        groupCount: this.groupCount,
        removedMembers: this.removedMembers,
        state: this.state,
        id: this.id,
        registerLinkId: this.registerLinkId ?? null,
        round: this.round,
      });
      return;
    } catch (error) {
      console.error(error);
      throw new Error("Error updating database");
    }
  }
  async disableDatabase() {
    // some action here
    this.status = false;
    return;
  }
  async validateUserRegistration() {
    // Some action here
    const flag1 = this.members.length === 0;
    const flag2 = this.groupCount;
    return;
  }
  async sendRegistration() {
    // Send action here
    return;
  }
}
