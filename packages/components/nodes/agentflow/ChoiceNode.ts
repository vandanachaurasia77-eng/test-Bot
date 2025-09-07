import { INode, INodeData, INodeParams } from '../../src/Interface'

class ChoiceNode implements INode {
    label: string
    name: string
    type: string
    icon: string
    category: string
    description: string
    baseClasses: string[]

    inputs: INodeParams[]
    outputs: INodeParams[]

    constructor() {
        this.label = 'Choice Node'
        this.name = 'choiceNode'
        this.type = 'Choice'
        this.icon = 'fa-hand-pointer' // any FontAwesome icon
        this.category = 'Chat'
        this.description = 'Presents multiple choices and saves user selection'
        this.baseClasses = ['ChoiceNode']

        this.inputs = [
            {
                label: 'Question',
                name: 'question',
                type: 'string',
                default: 'Please choose an option:'
            },
            {
                label: 'Choices (comma-separated)',
                name: 'choices',
                type: 'string',
                default: '1️⃣ Rooms, 2️⃣ Location, 3️⃣ Book a Room, 4️⃣ Schedule a Call'
            }
        ]

        this.outputs = [
            {
                label: 'Selected Choice',
                name: 'output',
                type: 'string'
            }
        ]
    }

    async run(nodeData: INodeData): Promise<any> {
        const question = nodeData.inputs?.question as string
        const choices = (nodeData.inputs?.choices as string).split(',')
        // Simulate: return the variable user will fill later
        return `${question}\n\n${choices.join('\n')}`
    }
}

module.exports = { nodeClass: ChoiceNode }
